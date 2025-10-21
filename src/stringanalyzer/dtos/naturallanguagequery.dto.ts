import { IsString, IsNotEmpty } from "class-validator";

export class NaturalLanguageQueryDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}

export interface ParsedFilters {
  is_palindrome?: boolean;
  min_length?: number;
  max_length?: number;
  word_count?: number;
  contains_character?: string;
}

export interface InterpretedQuery {
  original: string;
  parsed_filters: ParsedFilters;
}