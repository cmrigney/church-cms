import { Request, Response, NextFunction, RequestHandler } from "express";
import * as passport from "passport";

export function auth(method: RequestHandler): RequestHandler {
  return function(req: Request, res: Response, next: NextFunction) {
    if(!req.isAuthenticated())
      return res.sendStatus(403);

    return method(req, res, next);
  };
}
