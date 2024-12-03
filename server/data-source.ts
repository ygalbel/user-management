import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./model/user";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./database/users.db",
  synchronize: true, // Automatically create tables (turn off in production)
  logging: true,
  entities: [User],
});
