
import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsInt, IsObject, IsOptional, IsString, Length, Min } from 'class-validator';

export class StringAnalysisPropertiesDto {
 

    @IsInt()
    @Type(()=> Number)
  length: number;

    @IsBoolean()
  is_palindrome: boolean;

    
    @Type(() => Number)
        @IsInt()
  unique_characters: number;

    @Type(() => Number)
    @IsInt()
  word_count: number;

    @IsString()
    sha256_hash: string;

  @IsDefined()
   @IsObject()
  character_frequency_map: Record<string, number>;
}