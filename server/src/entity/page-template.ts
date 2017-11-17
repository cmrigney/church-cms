import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import { Placeholder } from "./placeholder";
import { IsNotEmpty, IsDefined, ValidateNested } from "class-validator";

@Entity()
export class PageTemplate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(type => Placeholder, placeholder => placeholder.pageTemplate, { eager: true, cascadeInsert: true, cascadeUpdate: true })
  @IsDefined()
  @ValidateNested()
  placeholders: Placeholder[];

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  content: string;
}