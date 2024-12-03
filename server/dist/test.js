"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
const user_1 = require("./model/user");
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Initialize the data source
        yield data_source_1.AppDataSource.initialize();
        console.log("Database connection established.");
        // Example: Insert a new user
        const userRepository = data_source_1.AppDataSource.getRepository(user_1.User);
        const newUser = userRepository.create({
            FirstName: "John",
            LastName: "Doe",
            EmailAddress: "john.doe@example.com",
            Password: "securepassword",
        });
        yield userRepository.save(newUser);
        console.log("New user saved:", newUser);
        // Example: Fetch all users
        const users = yield userRepository.find();
        console.log("Users:", users);
    }
    catch (error) {
        console.error("Error during database initialization:", error);
    }
});
start();
