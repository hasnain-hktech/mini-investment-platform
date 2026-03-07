import { UserController } from "../../controllers/user.controller";
import { UserService } from "../../services/user.service";
import { ConflictError, ValidationError } from "../../types/errors";

const mockService = {
  signup: jest.fn(),
} as unknown as jest.Mocked<UserService>;

const controller = new UserController(mockService);

const mockReq = (body: object) => ({ body }) as any;
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
