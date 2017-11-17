import * as express from "express";
import { asyncHandler } from "../helpers/express-async";
import { User } from "../entity/user";

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  const user = req.user as User;
  if(user)
    res.json({ valid: true, user: { username: user.username, firstName: user.firstName, lastName: user.lastName } });
  else
    res.json({ valid: false });
});

export default userRouter;
