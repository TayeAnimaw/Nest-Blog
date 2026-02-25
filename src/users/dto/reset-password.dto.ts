export class ResetPasswordDto {
  email!: string;
}

export class SetNewPasswordDto {
  token!: string;
  newPassword!: string;
}
