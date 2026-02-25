export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  EDITOR = 'editor',
}

export class User {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  role!: UserRole;
  profilePicture?: string;
  bio?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
