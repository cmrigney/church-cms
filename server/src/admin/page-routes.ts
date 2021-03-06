import { Router } from "express";
import { auth } from "../helpers/auth";
import { asyncHandler } from "../helpers/express-async";
import { PageTemplate } from "../entity/page-template";
import { validate } from "class-validator";
import * as _ from 'lodash';
import { Placeholder } from "../entity/placeholder";
import { Page } from "../entity/page";
import { PageContent } from "../entity/page-content";
import { invalidatePageCache } from '../services/cache/page-cache';

const pageRouter = Router();

pageRouter.get('/',  auth(asyncHandler(async (req, res) => {
  return res.json(await Page.find());
})));

pageRouter.get('/:id',  auth(asyncHandler(async (req, res) => {
  const page = await Page.findOneById(req.params.id, { relations: ['pageTemplate', 'pageContents'] });
  if(!page)
    return res.sendStatus(404);
  page.pageTemplate.placeholders = await Placeholder.find({ where: { pageTemplate: page.pageTemplate.id } });
  return res.json(page);
})));

pageRouter.put('/:id',  auth(asyncHandler(async (req, res) => {
  const page = await Page.findOneById(req.params.id);
  if(!page)
    return res.sendStatus(404);

  _.assign(page, _.pick(req.body, ['title', 'path', 'pageTemplate', 'pageContents']));
  
  // do this so classes are created
  page.pageContents = page.pageContents.map((p => _.assign(new PageContent(), _.pick(p, ['id', 'key', 'content']))));
  // lower case for consistency
  page.path = page.path.toLowerCase();

  await page.save();
  invalidatePageCache();
  return res.json(page);
})));

pageRouter.delete('/:id',  auth(asyncHandler(async (req, res) => {
  await Page.removeById(req.params.id);
  invalidatePageCache();
  return res.sendStatus(200);
})));

pageRouter.post('/', auth(asyncHandler(async (req, res) => {
  const page = new Page();
  Object.assign(page, req.body);
  let errors = await validate(page, { validationError: { target: false } });
  // lower case consistently
  page.path = page.path.toLowerCase();
  if(errors.length > 0)
    return res.status(400).json(errors);
  
  await page.save();
  invalidatePageCache();
  return res.status(201).json(page);
})));

export default pageRouter;
