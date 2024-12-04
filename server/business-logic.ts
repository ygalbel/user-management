// user-service/server/business-logic.ts
import { AppDataSource } from "./data-source";
import { User } from "./model/user";

const MAX_RETRIES = 3; // Number of retries
const RETRY_DELAY_MS = 1000; // Delay between retries in milliseconds

async function retryableOperation(operation: () => Promise<any>) {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      if (attempt >= MAX_RETRIES) throw error; // Rethrow if max retries reached
      console.warn(`Retrying... Attempt ${attempt}`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS)); // Wait before next attempt
    }
  }
}

export const BusinessLogic = {
  createUser: async (userData: Partial<User>) => {
    return await retryableOperation(async () => {
      const userRepository = AppDataSource.getRepository(User);

      // Convert email to uppercase
      if (userData.EmailAddress) {
        userData.EmailAddress = userData.EmailAddress.toUpperCase();
      }

      const newUser = userRepository.create(userData);
      return await userRepository.save(newUser);
    });
  },

  getUsers: async () => {
    return await retryableOperation(async () => {
      const userRepository = AppDataSource.getRepository(User);
      return await userRepository.find();
    });
  },

  getUserById: async (id: string) => {
    return await retryableOperation(async () => {
      const userRepository = AppDataSource.getRepository(User);
      return await userRepository.findOneBy({ ID: id });
    });
  },

  deleteUser: async (id: string) => {
    return await retryableOperation(async () => {
      const userRepository = AppDataSource.getRepository(User);
      return await userRepository.delete(id);
    });
  },
};
