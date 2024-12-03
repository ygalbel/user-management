import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { User } from "./model/user";
import bcrypt from "bcrypt";

const app = express();
const PORT = process.env.PORT || 3002;

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
    const userRepository = AppDataSource.getRepository(User);

    // ensure the email is not already existing
    const existingUser = await userRepository.findOneBy({
      EmailAddress: req.body.EmailAddress,
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // let's hash the password before saving
    const hashedPassword = await bcrypt.hash(req.body.Password, 10);
    const user = req.body;
    user.Password = hashedPassword;

    const newUser = userRepository.create(req.body);
    const savedUser = await userRepository.save(newUser);
    res.status(201).json({
      ...savedUser,
      Password: "REMOVED",
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
});

// Get all users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();

    const safeUsers = users.map((user) => ({ ...user, Password: "REMOVED" }));
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Get a user by ID
app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ ID: req.params.id });
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
    const userRepository = AppDataSource.getRepository(User);
    const result = await userRepository.delete(req.params.id);
    if (result.affected) {
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
