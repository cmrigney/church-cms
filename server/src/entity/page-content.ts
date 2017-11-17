import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import { Page } from "./page";

@Entity()
export class PageContent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Page, page => page.pageContents, { cascadeAll: true, onDelete: 'CASCADE' })
  page: Page;

  @Column()
  key: string;

  @Column()
  content: string;
}