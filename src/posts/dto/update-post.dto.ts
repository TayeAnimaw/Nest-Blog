import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
