import { UserService } from "../../services/user.service";
import { IUserRepository } from "../../repositories/user.repository";

// Mock repository — fake implementation of IUserRepository
const mockRepository: jest.Mocked<IUserRepository> = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

// Create service with mock repository injected
const userService = new UserService(mockRepository);

// Reset mocks before each test so they don't bleed into each other
beforeEach(() => {
  jest.clearAllMocks();
});

describe("UserService.signup", () => {
  it("should throw ValidationError if firstName is empty", async () => {
    // call userService.signup with incomplete data (e.g. empty firstName)
    // expect it to throw with message "All fields are required"
    await expect(
      userService.signup({
        email: "invalid-email",
        firstName: "",
        lastName: "Doe",
        password: "password",
      }),
    ).rejects.toThrow("All fields are required");
  });
  it("should throw ValidationError if email is invalid", async () => {
    // call userService.signup with an invalid email
    // expect it to throw with message "Invalid email format"
    await expect(
      userService.signup({
        email: "invalid-email",
        firstName: "John",
        lastName: "Doe",
        password: "password",
      }),
    ).rejects.toThrow("Invalid email format");
  });

  it("should throw ConflictError if email already exists", async () => {
    // make mockRepository.findByEmail return a fake user
    // call userService.signup with that email
    // expect it to throw with message "User already exists"
    mockRepository.findByEmail.mockResolvedValue({
      id: "1",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "hashed-password",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await expect(
      userService.signup({
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "password",
      }),
    ).rejects.toThrow("User already exists");
  });

  it("should create user and return UserResponse without password", async () => {
    // make mockRepository.findByEmail return null (email doesn't exist)
    // make mockRepository.create return a fake user
    // call userService.signup with valid data
    // expect the response to have id, email, firstName, lastName
    // expect the response to NOT have password
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue({
      id: "1",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "hashed-password",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await userService.signup({
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "password",
    });

    expect(result).toEqual({
      id: "1",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
    });
  });
});
