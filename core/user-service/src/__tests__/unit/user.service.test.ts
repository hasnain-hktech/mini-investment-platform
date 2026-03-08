import { UserService } from "../../services/user.service";
import { IUserRepository } from "../../repositories/user.repository";
import { IEmailService } from "../../services/email.service";

const mockRepository: jest.Mocked<IUserRepository> = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  saveVerificationToken: jest.fn(),
  findByVerificationToken: jest.fn(),
  markEmailVerified: jest.fn(),
};

const mockEmailService: jest.Mocked<IEmailService> = {
  sendVerificationEmail: jest.fn(),
};

const userService = new UserService(mockRepository, mockEmailService);

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
      isEmailVerified: false,
      verificationToken: null,
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
      isEmailVerified: false,
      verificationToken: null,
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

describe("UserService.verifyEmail", () => {
  it("should throw NotFoundError if token is invalid", async () => {
    // your turn:
    // make mockRepository.findByVerificationToken return null
    // expect it to throw "Invalid or expired token"
    mockRepository.findByVerificationToken.mockResolvedValue(null);
    await expect(userService.verifyEmail("invalid-token")).rejects.toThrow(
      "Invalid or expired token",
    );
  });

  it("should throw ValidationError if email already verified", async () => {
    // your turn:
    // make mockRepository.findByVerificationToken return a user with isEmailVerified: true
    // expect it to throw "Email already verified"
    mockRepository.findByVerificationToken.mockResolvedValue({
      id: "1",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "hashed-password",
      isEmailVerified: true,
      verificationToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await expect(userService.verifyEmail("valid-token")).rejects.toThrow(
      "Email already verified",
    );
  });

  it("should mark email as verified successfully", async () => {
    // your turn:
    // make mockRepository.findByVerificationToken return a user with isEmailVerified: false
    // call userService.verifyEmail with a token
    // expect mockRepository.markEmailVerified to have been called with the user id
    mockRepository.findByVerificationToken.mockResolvedValue({
      id: "1",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "hashed-password",
      isEmailVerified: false,
      verificationToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await userService.verifyEmail("valid-token");
    expect(mockRepository.markEmailVerified).toHaveBeenCalledWith("1");
  });
});
