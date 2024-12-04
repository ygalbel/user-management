import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import bcrypt from "bcrypt";
import cors from "cors";
import { BusinessLogic } from "./business-logic";
import { User } from "./model/user";

const app = express();
const PORT = process.env.PORT || 3002;

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Initialize TypeORM connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((error) => {
    console.error("Error during database initialization:", error);
  });

// CRUD Endpoints

// Create a new user
app.post("/users", async (req: Request, res: Response) => {
  try {
    // Check for existing user
    const existingUser = await BusinessLogic.getUsers();
    if (
      existingUser.some(
        (user: User) => user.EmailAddress === req.body.EmailAddress,
      )
    ) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(req.body.Password, 10);
    req.body.Password = hashedPassword;

    const savedUser = await BusinessLogic.createUser(req.body);
    res.status(201).json({ ...savedUser, Password: "REMOVED" });
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
});

// Get all users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await BusinessLogic.getUsers();
    const safeUsers = users.map((user: User) => ({
      ...user,
      Password: "REMOVED",
    }));
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Get a user by ID
app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const user = await BusinessLogic.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// Delete a user
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await BusinessLogic.deleteUser(req.params.id);
    if (result.affected > 0) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// for testing purpose
export default app;
