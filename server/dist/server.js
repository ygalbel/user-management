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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cors_1 = __importDefault(require("cors"));
const business_logic_1 = require("./business-logic");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
// Enable CORS
app.use((0, cors_1.default)());
// Middleware to parse JSON
app.use(express_1.default.json());
// Initialize TypeORM connection
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connected successfully.");
})
    .catch((error) => {
    console.error("Error during database initialization:", error);
});
// CRUD Endpoints
// Create a new user
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for existing user
        const existingUser = yield business_logic_1.BusinessLogic.getUsers();
        if (existingUser.some((user) => user.EmailAddress === req.body.EmailAddress)) {
            return res.status(409).json({ message: "Email already in use" });
        }
        // Hash the password before saving
        const hashedPassword = yield bcrypt_1.default.hash(req.body.Password, 10);
        req.body.Password = hashedPassword;
        const savedUser = yield business_logic_1.BusinessLogic.createUser(req.body);
        res.status(201).json(Object.assign(Object.assign({}, savedUser), { Password: "REMOVED" }));
    }
    catch (error) {
        res.status(400).json({ message: "Error creating user", error });
    }
}));
// Get all users
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield business_logic_1.BusinessLogic.getUsers();
        const safeUsers = users.map((user) => (Object.assign(Object.assign({}, user), { Password: "REMOVED" })));
        res.json(safeUsers);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
}));
// Get a user by ID
app.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield business_logic_1.BusinessLogic.getUserById(req.params.id);
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
}));
// Delete a user
app.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield business_logic_1.BusinessLogic.deleteUser(req.params.id);
        if (result.affected > 0) {
            res.json({ message: "User deleted successfully" });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
}));
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// for testing purpose
exports.default = app;
