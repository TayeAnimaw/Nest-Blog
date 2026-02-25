export class User {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  profilePicture?: string;
  bio?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
