import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, OneToOne, JoinColumn} from "typeorm";
import { PageContent } from "./page-content";
import { PageTemplate } from "./page-template";

@Entity()
export class Page extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  path: string;

  @OneToOne(type => PageTemplate)
  @JoinColumn()
  pageTemplate: PageTemplate;

  @OneToMany(type => PageContent, pageContent => pageContent.page, { cascadeInsert: true, cascadeUpdate: true })
  pageContents: PageContent[];
}