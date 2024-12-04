import request from "supertest";
import app from "../server/server"; // Adjust the import according to your project's structure
import { AppDataSource } from "../server/data-source";
import { User } from "../server/model/user";

beforeAll(async () => {
  await AppDataSource.initialize();
  await AppDataSource.getRepository(User).clear(); // Clean user table before tests
});

afterEach(async () => {
  await AppDataSource.getRepository(User).clear(); // Clean up after each test to ensure isolation
});

afterAll(async () => {
  await AppDataSource.destroy();
});

// Utility function to generate a random email
const generateRandomEmail = (): string => {
  const randomString = Math.random().toString(36).substring(2, 10); // Generate a random string
  return `user_${randomString}@example.com`; // Generate a random email address
};

describe("User API", () => {
  let createdUserId: string;

  it("should create a new user", async () => {
    const emailAddress = generateRandomEmail();
    const response = await request(app).post("/users").send({
      FirstName: "John",
      LastName: "Doe",
      EmailAddress: emailAddress,
      Password: "securepassword",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("ID");
    expect(response.body.FirstName).toBe("John");
    expect(response.body.LastName).toBe("Doe");
    expect(response.body.EmailAddress).toBe(emailAddress.toUpperCase()); // Expecting uppercase
    createdUserId = response.body.ID; // Save the created user's id for further tests
  });

  it("should get the list of all users", async () => {
    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1); // Expecting one user (the one created)
    expect(response.body[0]).toHaveProperty("ID");
    expect(response.body[0].EmailAddress).toBe("JOHNDOE@EXAMPLE.COM"); // Check email case
  });

  it("should get the created user by id", async () => {
    const response = await request(app).get(`/users/${createdUserId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("ID", createdUserId);
    expect(response.body.FirstName).toBe("John");
  });

  it("should delete the created user", async () => {
    const response = await request(app).delete(`/users/${createdUserId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
  });

  it("should return 404 when getting deleted user", async () => {
    const response = await request(app).get(`/users/${createdUserId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});
