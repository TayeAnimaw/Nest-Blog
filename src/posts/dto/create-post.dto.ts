import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'My First Post', description: 'Post title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'This is the content of my post', description: 'Post content' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ example: 'John Doe', description: 'Post author' })
  @IsString()
  @IsNotEmpty()
  author!: string;

  @ApiPropertyOptional({ example: false, description: 'Published status' })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
