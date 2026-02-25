import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiPropertyOptional({ example: 'Updated Title', description: 'Post title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated content', description: 'Post content' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ example: 'Jane Doe', description: 'Post author' })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({ example: true, description: 'Published status' })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
