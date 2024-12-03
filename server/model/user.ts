import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity("Users")
@Unique(["EmailAddress"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  ID!: string;

  @Column({ type: "varchar", length: 255 })
  FirstName!: string;

  @Column({ type: "varchar", length: 255 })
  LastName!: string;

  @Column({ type: "varchar", length: 255 })
  EmailAddress!: string;

  @Column({ type: "varchar", length: 255 })
  Password!: string;
}
