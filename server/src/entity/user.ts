import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  hashedPassword: string;

  @Column()
  salt: string;

  @Column()
  admin: boolean;

  validatePassword(password: string): boolean {

  }
}
