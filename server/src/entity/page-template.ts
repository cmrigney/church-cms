import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import { Placeholder } from "./placeholder";

@Entity()
export class PageTemplate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(type => Placeholder, placeholder => placeholder.pageTemplate)
  placeholders: Placeholder[];

  @Column()
  content: string;
}