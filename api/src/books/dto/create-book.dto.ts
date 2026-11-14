import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  author!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  isbn!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalCopies!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  genreId!: number;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
