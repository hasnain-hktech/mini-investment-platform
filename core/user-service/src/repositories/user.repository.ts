import { PrismaClient, User } from "@prisma/client";
import { SignupDto } from "../types/user.types";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: SignupDto): Promise<User>;
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
}
