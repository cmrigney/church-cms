
import * as express from "express";
import * as passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./entity/user";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as path from "path";

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
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({ secret: 'some secret'}));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/admin/logout', (req, res) => {
    req.logout();
    res.redirect('/admin/login');
  });

  app.post('/admin/login', passport.authenticate('local', { 
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true }));
  

  app.get('/', (req, res) => res.send('Hello'));

  return app;
}
