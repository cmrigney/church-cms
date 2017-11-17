import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import { PageTemplate } from "./page-template";

@Entity()
export class Placeholder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => PageTemplate, pageTemplate => pageTemplate.placeholders, { cascadeAll: true, onDelete: 'CASCADE' })
  pageTemplate: PageTemplate;

  @Column()
  key: string;

  @Column()
  description: string;
}