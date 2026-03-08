import bcrypt from "bcrypt";
import { IUserRepository } from "../repositories/user.repository";
import { SignupDto, UserResponse } from "../types/user.types";
import { ValidationError, ConflictError } from "../types/errors";
import { IEmailService } from "./email.service";

export class UserService {
  constructor(
    private repository: IUserRepository,
    private emailService: IEmailService,
  ) {}

  async signup(data: SignupDto): Promise<UserResponse> {
    // your turn — implement the 6 steps
    // Step 1: firstName, lastName, email, password are all required
    if (!data.firstName || !data.lastName || !data.email || !data.password) {
      throw new ValidationError("All fields are required");
    }

    //Step 2: validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new ValidationError("Invalid email format");
    }

    // Step 3: Check if user already exists
    const existingUser = await this.repository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    // Step 4: Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Step 5: Create the user
    const user = await this.repository.create({
      ...data,
      password: hashedPassword,
    });

    // Step 6: Generate verification token
    // Step 7: Save token to DB
    // Step 8: Send verification email

    const verificationToken = crypto.randomUUID();
    await this.repository.saveVerificationToken(user.id, verificationToken);
    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
    );

    // Step 9: Return the user response
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
