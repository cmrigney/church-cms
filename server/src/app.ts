
import * as express from "express";
import * as passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./entity/user";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as path from "path";
import adminRoutes from "./admin/routes";
import siteRoutes from './site';

export function createApp() : express.Express {
  const app = express();

  passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }).then((user) => {
      if(!user || !user.validatePassword(password)) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      return done(null, user);
    })
    .catch((err) => {
      return done(err);
    });
  }));

  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findOneById(id).then((user) => {
      if(!user)
        return done(new Error("User not found"));
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
  });

  app.use('/admin', express.static(path.join(__dirname, "../../client/build")));
  app.use(bodyParser.json());
  app.use(session({ secret: 'some secret'}));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/api/admin', adminRoutes);

  app.post('/admin/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
  });

  app.post('/admin/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return res.status(401).json({ error: err.message }); }
      if(!user)
        return res.status(401).json({ error: info.message });

      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.sendStatus(200);
      });
    })(req, res, next);
  });
  
  app.use(siteRoutes);
  app.get('/', (req, res) => res.send('No home page set'));

  //spa fallback
  app.use((req, res, next) => {
    if(req.path.toLowerCase().startsWith('/admin')) {
      return res.sendFile('index.html', { root: path.join(__dirname, '../../client/build') });
    }
    next();
  });

  return app;
}
