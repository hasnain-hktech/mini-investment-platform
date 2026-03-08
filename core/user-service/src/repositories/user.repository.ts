import { PrismaClient, User } from "@prisma/client";
import { SignupDto } from "../types/user.types";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: SignupDto): Promise<User>;
  saveVerificationToken(userId: string, token: string): Promise<void>;
  findByVerificationToken(token: string): Promise<User | null>;
  markEmailVerified(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: SignupDto): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async saveVerificationToken(userId: string, token: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { verificationToken: token },
    });
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { verificationToken: token },
    });
  }

  async markEmailVerified(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { isEmailVerified: true, verificationToken: null },
    });
  }
}
