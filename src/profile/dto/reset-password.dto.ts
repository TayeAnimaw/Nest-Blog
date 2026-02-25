import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  @IsEmail()
  email!: string;
}

export class SetNewPasswordDto {
  @ApiProperty({ example: 'abc123def456', description: 'Reset token' })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({ example: 'newPassword123', description: 'New password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword!: string;
}
