import { Page } from "../entity/page";
import { PageResult } from '../helpers/types';
import { PageContent } from '../entity/page-content';

export async function renderPage(pagePath: string): Promise<PageResult> {
  let page = await Page.findOne({ where: { path: pagePath }, relations: ['pageTemplate', 'pageContents'] });
  if(!page)
    return null;

  const template = page.pageTemplate;
  const pageContents = page.pageContents;
  let pageData = template.content;
  pageContents.forEach(pc => {
    pageData = pageData.split(`@@${pc.key}@@`).join(pc.content);
  });
  return {
    pageContent: pageData
  };
}
