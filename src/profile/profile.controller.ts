import { Controller, Get, Put, Post, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResetPasswordDto, SetNewPasswordDto } from './dto/reset-password.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@Request() req: { user: { sub: number } }) {
    return this.profileService.getProfile(req.user.sub);
  }

  @Put()
  updateProfile(
    @Request() req: { user: { sub: number } },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(req.user.sub, updateProfileDto);
  }

  @Put('picture')
  updateProfilePicture(
    @Request() req: { user: { sub: number } },
    @Body('profilePicture') profilePicture: string,
  ) {
    return this.profileService.updateProfilePicture(req.user.sub, profilePicture);
  }

  @Post('change-password')
  changePassword(
    @Request() req: { user: { sub: number } },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.profileService.changePassword(req.user.sub, changePasswordDto);
  }
}

// Public endpoints for password reset
@Controller('auth')
export class PasswordResetController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('reset-password')
  requestPasswordReset(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.profileService.requestPasswordReset(resetPasswordDto.email);
  }

  @Post('set-new-password')
  resetPassword(@Body() setNewPasswordDto: SetNewPasswordDto) {
    return this.profileService.resetPassword(setNewPasswordDto);
  }
}
