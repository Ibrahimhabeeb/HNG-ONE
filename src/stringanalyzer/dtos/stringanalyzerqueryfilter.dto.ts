import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class GetStringsFilterDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  is_palindrome?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  min_length?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  max_length?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  word_count?: number;

  @IsOptional()
  @IsString()
  @Length(1, 1)
  contains_character?: string;
}
