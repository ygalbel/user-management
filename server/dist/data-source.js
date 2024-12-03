"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const user_1 = require("./model/user");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "./database/users.db",
    synchronize: true, // Automatically create tables (turn off in production)
    logging: true,
    entities: [user_1.User],
});
