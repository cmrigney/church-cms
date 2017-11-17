import { PageTemplate } from "./page-template";
import { PageContent } from "./page-content";

export interface Page {
  id?: number;
  title: string;
  path: string;
  pageTemplate?: PageTemplate;
  pageContents?: PageContent[];
}