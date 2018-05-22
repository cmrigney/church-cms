import { Router } from "express";
import { auth } from "../helpers/auth";
import { asyncHandler } from "../helpers/express-async";
import { PageTemplate } from "../entity/page-template";
import { validate } from "class-validator";
import * as _ from 'lodash';
import { Placeholder } from "../entity/placeholder";
import { invalidatePageCache } from '../services/cache/page-cache';

const pageTemplateRouter = Router();

pageTemplateRouter.get('/',  auth(asyncHandler(async (req, res) => {
  return res.json(await PageTemplate.find());
})));

pageTemplateRouter.get('/:id',  auth(asyncHandler(async (req, res) => {
  const pageTemplate = await PageTemplate.findOneById(req.params.id);
  if(!pageTemplate)
    return res.sendStatus(404);
  return res.json(pageTemplate);
})));

pageTemplateRouter.put('/:id',  auth(asyncHandler(async (req, res) => {
  const pageTemplate = await PageTemplate.findOneById(req.params.id);
  if(!pageTemplate)
    return res.sendStatus(404);

  _.assign(pageTemplate, _.pick(req.body, ['name', 'content', 'placeholders']));
  
  // do this so classes are created
  pageTemplate.placeholders = pageTemplate.placeholders.map((p => _.assign(new Placeholder(), _.pick(p, ['id', 'key', 'description']))));

  await pageTemplate.save();
  invalidatePageCache();
  return res.json(pageTemplate);
})));

pageTemplateRouter.delete('/:id',  auth(asyncHandler(async (req, res) => {
  await PageTemplate.removeById(req.params.id);
  invalidatePageCache();
  return res.sendStatus(200);
})));

pageTemplateRouter.post('/', auth(asyncHandler(async (req, res) => {
  const pageTemplate = new PageTemplate();
  Object.assign(pageTemplate, req.body);
  let errors = await validate(pageTemplate, { validationError: { target: false } });
  if(errors.length > 0)
    return res.status(400).json(errors);
  
  await pageTemplate.save();
  invalidatePageCache();
  return res.status(201).json(pageTemplate);
})));

export default pageTemplateRouter;
