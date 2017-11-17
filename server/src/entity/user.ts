import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import * as bcrypt from 'bcrypt';

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
  admin: boolean;

  validatePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.hashedPassword);
  }

  setPassword(password: string) {
    this.hashedPassword = bcrypt.hashSync(password, 10);
  }

  static createUser(username: string, password: string, firstName: string, lastName: string, admin: boolean) : User {
    const user = new User();
    user.username = username;
    user.setPassword(password);
    user.firstName = firstName;
    user.lastName = lastName;
    user.admin = admin;
    return user;
  }
}
