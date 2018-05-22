import * as express from 'express';
import { asyncHandler } from './helpers/express-async';
import { Page } from "./entity/page";
import { getPageCache } from './services/cache/page-cache';
import { renderPage } from './services/page-renderer';

const SiteRouter = express.Router();

SiteRouter.use('/', asyncHandler(async (req, res, next) => {
  const pagePath = req.path.toLowerCase();

  const cachedPage = await getPageCache().get(pagePath);
  if(cachedPage)
    return res.send(cachedPage.pageContent);

  const pageResult = await renderPage(pagePath);
  if(!pageResult)
    return next();
  else {
    await getPageCache().set(pagePath, pageResult);
    return res.send(pageResult.pageContent);
  }
}));

export default SiteRouter;
