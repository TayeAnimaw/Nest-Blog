import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Headers, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResetPasswordDto, SetNewPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.usersService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @Post('logout')
  logout() {
    // In a real app with JWT, you'd invalidate the token here
    return { message: 'Logged out successfully' };
  }

  @Post('change-password')
  changePassword(
    @Headers('x-user-id') userIdHeader: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    if (!userIdHeader) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = parseInt(userIdHeader, 10);
    return this.usersService.changePassword(userId, changePasswordDto);
  }

  @Post('reset-password')
  requestPasswordReset(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.requestPasswordReset(resetPasswordDto.email);
  }

  @Post('set-new-password')
  resetPassword(@Body() setNewPasswordDto: SetNewPasswordDto) {
    return this.usersService.resetPassword(setNewPasswordDto);
  }

  @Get('profile')
  getProfile(@Headers('x-user-id') userIdHeader: string) {
    if (!userIdHeader) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = parseInt(userIdHeader, 10);
    return this.usersService.getProfile(userId);
  }

  @Put('profile')
  updateProfile(
    @Headers('x-user-id') userIdHeader: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    if (!userIdHeader) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = parseInt(userIdHeader, 10);
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @Put('profile-picture')
  updateProfilePicture(
    @Headers('x-user-id') userIdHeader: string,
    @Body('profilePicture') profilePicture: string,
  ) {
    if (!userIdHeader) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = parseInt(userIdHeader, 10);
    return this.usersService.updateProfilePicture(userId, profilePicture);
  }

  // Legacy CRUD endpoints (for backward compatibility)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
