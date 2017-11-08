import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import { PageContent } from "./page-content";

@Entity()
export class Page extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  path: string;

  @Column()
  pageTemplateId: number;

  @OneToMany(type => PageContent, pageContent => pageContent.page)
  pageContents: PageContent[];
}