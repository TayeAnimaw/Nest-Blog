import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsNotEmpty()
  author!: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
