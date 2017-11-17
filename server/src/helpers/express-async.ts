import * as express from 'express';

export function asyncHandler(handler: (req: express.Request, res: express.Response, next?: express.NextFunction) => Promise<any>) : express.RequestHandler {
  return function(req: express.Request, res: express.Response, next: express.NextFunction) {
    handler(req, res, next).catch(next);
  };
}

