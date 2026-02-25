import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SetNewPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = this.users.find((u) => u.email === registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user: User = {
      id: this.idCounter++,
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
    const { password, ...result } = user;
    return result as User;
  }

  async login(loginDto: LoginDto): Promise<{ user: User; accessToken: string }> {
    const user = this.users.find((u) => u.email === loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const { password, ...result } = user;
    // Generate a simple token (in production, use JWT)
    const accessToken = Buffer.from(`${user.id}:${user.email}`).toString('base64');
    
    return { user: result as User, accessToken };
  }

  async validateUser(userId: number): Promise<User> {
    const user = this.users.find((u) => u.id === userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }
    const { password, ...result } = user;
    return result as User;
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.updatedAt = new Date();

    return { message: 'Password changed successfully' };
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const user = this.users.find((u) => u.email === email);
    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the email exists, a reset link will be sent' };
    }

    // Generate reset token (in production, use crypto.randomBytes)
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    user.updatedAt = new Date();

    // In production, send email with reset link
    console.log(`Reset token for ${email}: ${resetToken}`);

    return { message: 'If the email exists, a reset link will be sent' };
  }

  async resetPassword(setNewPasswordDto: SetNewPasswordDto): Promise<{ message: string }> {
    const user = this.users.find((u) => u.resetToken === setNewPasswordDto.token);
    
    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    user.password = await bcrypt.hash(setNewPasswordDto.newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    user.updatedAt = new Date();

    return { message: 'Password reset successfully' };
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateProfileDto.name) user.name = updateProfileDto.name;
    if (updateProfileDto.bio !== undefined) user.bio = updateProfileDto.bio;
    if (updateProfileDto.profilePicture !== undefined) user.profilePicture = updateProfileDto.profilePicture;
    user.updatedAt = new Date();

    const { password, ...result } = user;
    return result as User;
  }

  async updateProfilePicture(userId: number, profilePicture: string): Promise<User> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.profilePicture = profilePicture;
    user.updatedAt = new Date();

    const { password, ...result } = user;
    return result as User;
  }

  async getProfile(userId: number): Promise<User> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result as User;
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
