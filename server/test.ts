import { AppDataSource } from "./data-source";
import { User } from "./model/user";

const start = async () => {
  try {
    // Initialize the data source
    await AppDataSource.initialize();
    console.log("Database connection established.");

    // Example: Insert a new user
    const userRepository = AppDataSource.getRepository(User);

    const newUser = userRepository.create({
      FirstName: "John",
      LastName: "Doe",
      EmailAddress: "john.doe@example.com",
      Password: "securepassword",
    });

    await userRepository.save(newUser);
    console.log("New user saved:", newUser);

    // Example: Fetch all users
    const users = await userRepository.find();
    console.log("Users:", users);
  } catch (error) {
    console.error("Error during database initialization:", error);
  }
};

start();
