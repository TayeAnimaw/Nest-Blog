import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserRole } from './entities/user.entity';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
}

export interface UpdateUserData {
  name?: string;
  bio?: string;
  profilePicture?: string;
  password?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  async create(data: CreateUserData): Promise<User> {
    const user: User = {
      id: this.idCounter++,
      name: data.name,
      email: data.email,
      password: data.password,
      role: UserRole.USER,
      isActive: data.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
    return user;
  }

  async update(id: number, data: UpdateUserData): Promise<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.name !== undefined) user.name = data.name;
    if (data.bio !== undefined) user.bio = data.bio;
    if (data.profilePicture !== undefined) user.profilePicture = data.profilePicture;
    if (data.password !== undefined) user.password = data.password;
    if (data.resetToken !== undefined) user.resetToken = data.resetToken;
    if (data.resetTokenExpiry !== undefined) user.resetTokenExpiry = data.resetTokenExpiry;
    
    user.updatedAt = new Date();

    return user;
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async findByResetToken(token: string): Promise<User | undefined> {
    return this.users.find((u) => u.resetToken === token);
  }

  findAll(): Omit<User, 'password'>[] {
    return this.users.map(({ password, ...user }) => user);
  }

  findOne(id: number): Omit<User, 'password'> | undefined {
    const user = this.users.find((u) => u.id === id);
    if (!user) return undefined;
    const { password, ...result } = user;
    return result;
  }

  remove(id: number): void {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }
}
