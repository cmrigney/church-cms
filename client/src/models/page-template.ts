import { Placeholder } from "src/models/placeholder";

export interface PageTemplate {
  id?: number;
  name: string;
  content: string;
  placeholders: Placeholder[]
}
