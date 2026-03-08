import { UserController } from "../../controllers/user.controller";
import { UserService } from "../../services/user.service";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../types/errors";

const mockService = {
  signup: jest.fn(),
  verifyEmail: jest.fn(),
} as unknown as jest.Mocked<UserService>;

const controller = new UserController(mockService);

const mockReq = (body: object) =>
  ({
    body,
    headers: {},
  }) as any;

const mockVerifyReq = (token: string) =>
  ({
    query: { token },
    headers: {},
  }) as any;

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("UserController.signup", () => {
  it("should return 201 with user response on success", async () => {
    // mock service to return a fake user
    // call controller.signup
    // expect res.status(201) and res.json(user)
    const fakeUserResponse = {
      id: "1",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
    };
    mockService.signup.mockResolvedValue(fakeUserResponse);

    const req = mockReq({
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "password",
    });
    const res = mockRes();

    await controller.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeUserResponse);
  });

  it("should return 409 when ConflictError is thrown", async () => {
    const conflictError = new ConflictError("User already exists");
    mockService.signup.mockRejectedValue(conflictError);

    const req = mockReq({
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "password",
    });
    const res = mockRes();

    await controller.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: conflictError.message });
  });

  it("should return 400 when ValidationError is thrown", async () => {
    const validationError = new ValidationError("Invalid email format");
    mockService.signup.mockRejectedValue(validationError);

    const req = mockReq({
      email: "invalid-email",
      firstName: "John",
      lastName: "Doe",
      password: "password",
    });
    const res = mockRes();

    await controller.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: validationError.message });
  });

  it("should return 500 on Internal Server Error", async () => {
    const unexpectedError = new Error("Internal Server Error");
    mockService.signup.mockRejectedValue(unexpectedError);

    const req = mockReq({
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "password",
    });
    const res = mockRes();

    await controller.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});

describe("UserService.verifyEmail", () => {
  //Happy path — valid token → 200 + success message
  //Invalid token — service throws NotFoundError → 404
  //Already verified — service throws ValidationError → 400
  //Unexpected error — service throws generic error → 500
  //Missing token — no token in query string → what should happen?

  it("should return 200 with success message on valid token", async () => {
    // your turn:
    // make mockRepository.findByVerificationToken return a user with isEmailVerified: false
    // expect it to return 200 + success message
    mockService.verifyEmail.mockResolvedValue(undefined); // service doesn't return anything on success
    const req = mockVerifyReq("valid-token");
    const res = mockRes();
    await controller.verifyEmail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email verified successfully",
    });
  });

  it("should return 404 when NotFoundError is thrown", async () => {
    // your turn:
    // make mockRepository.findByVerificationToken return null
    // expect it to return 404 + error message
    const notFoundError = new NotFoundError("Invalid or expired token");
    mockService.verifyEmail.mockRejectedValue(notFoundError);
    const req = mockVerifyReq("invalid-token");
    const res = mockRes();
    await controller.verifyEmail(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: notFoundError.message });
  });

  it("should return 400 when ValidationError is thrown", async () => {
    // your turn:
    // make mockRepository.findByVerificationToken return a user with isEmailVerified: true
    // expect it to return 400 + error message
    const validationError = new ValidationError("Email already verified");
    mockService.verifyEmail.mockRejectedValue(validationError);
    const req = mockVerifyReq("valid-token");
    const res = mockRes();
    await controller.verifyEmail(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: validationError.message });
  });

  it("should return 500 on Internal Server Error", async () => {
    // your turn:
    // make service throw generic error
    // expect it to return 500 + error message
    const unexpectedError = new Error("Internal Server Error");
    mockService.verifyEmail.mockRejectedValue(unexpectedError);
    const req = mockVerifyReq("valid-token");
    const res = mockRes();
    await controller.verifyEmail(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});
