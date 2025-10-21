import { Injectable, BadRequestException, UnprocessableEntityException } from "@nestjs/common";
import { ParsedFilters } from "./dtos/naturallanguagequery.dto";

@Injectable()
export class NaturalLanguageParserService {

  parseQuery(query: string): ParsedFilters {
    const lowerQuery = query.toLowerCase().trim();
    const filters: ParsedFilters = {};

    try {
      // Parse palindrome
      if (this.containsPalindromeKeywords(lowerQuery)) {
        filters.is_palindrome = true;
      }

      // Parse word count
      const wordCount = this.extractWordCount(lowerQuery);
      if (wordCount !== null) {
        filters.word_count = wordCount;
      }

      // Parse length constraints
      const lengthConstraints = this.extractLengthConstraints(lowerQuery);
      if (lengthConstraints.min !== null) {
        filters.min_length = lengthConstraints.min;
      }
      if (lengthConstraints.max !== null) {
        filters.max_length = lengthConstraints.max;
      }

      // Parse character contains
      const containsChar = this.extractContainsCharacter(lowerQuery);
      if (containsChar) {
        filters.contains_character = containsChar;
      }

      // Validate that we parsed something
      if (Object.keys(filters).length === 0) {
        throw new BadRequestException('Unable to parse natural language query');
      }

      // Check for conflicting filters
      this.validateFilters(filters);

      return filters;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof UnprocessableEntityException) {
        throw error;
      }
      throw new BadRequestException('Unable to parse natural language query');
    }
  }

  private containsPalindromeKeywords(query: string): boolean {
    const palindromeKeywords = ['palindrome', 'palindromic', 'reads the same', 'same forwards and backwards'];
    return palindromeKeywords.some(keyword => query.includes(keyword));
  }

  private extractWordCount(query: string): number | null {
    
    const singleWordPatterns = ['single word', 'one word', '1 word'];
    const twoWordPatterns = ['two word', '2 word'];
    const threeWordPatterns = ['three word', '3 word'];

    for (const pattern of singleWordPatterns) {
      if (query.includes(pattern)) return 1;
    }
    for (const pattern of twoWordPatterns) {
      if (query.includes(pattern)) return 2;
    }
    for (const pattern of threeWordPatterns) {
      if (query.includes(pattern)) return 3;
    }

    // Match "X words" pattern with number
    const wordCountMatch = query.match(/(\d+)\s+words?/);
    if (wordCountMatch) {
      return parseInt(wordCountMatch[1], 10);
    }

    return null;
  }

  private extractLengthConstraints(query: string): { min: number | null; max: number | null } {
    let min: number | null = null;
    let max: number | null = null;

    // Match "longer than X", "more than X characters", "at least X"
    const longerThanMatch = query.match(/(?:longer than|more than|at least)\s+(\d+)/);
    if (longerThanMatch) {
      min = parseInt(longerThanMatch[1], 10) + 1;
    }

    // Match "shorter than X", "less than X characters", "at most X"
    const shorterThanMatch = query.match(/(?:shorter than|less than|fewer than)\s+(\d+)/);
    if (shorterThanMatch) {
      max = parseInt(shorterThanMatch[1], 10) - 1;
    }

    // Match "at most X"
    const atMostMatch = query.match(/at most\s+(\d+)/);
    if (atMostMatch) {
      max = parseInt(atMostMatch[1], 10);
    }

    // Match "between X and Y"
    const betweenMatch = query.match(/between\s+(\d+)\s+and\s+(\d+)/);
    if (betweenMatch) {
      min = parseInt(betweenMatch[1], 10);
      max = parseInt(betweenMatch[2], 10);
    }

    return { min, max };
  }

  private extractContainsCharacter(query: string): string | null {
    // Match "containing the letter X", "contains X", "with the letter X"
    const letterMatch = query.match(/(?:containing?|with|has)\s+(?:the\s+)?(?:letter|character)\s+([a-z])/i);
    if (letterMatch) {
      return letterMatch[1].toLowerCase();
    }

    // Match "first vowel", "second vowel", etc.
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    if (query.includes('first vowel')) return vowels[0];
    if (query.includes('second vowel')) return vowels[1];
    if (query.includes('third vowel')) return vowels[2];
    if (query.includes('fourth vowel')) return vowels[3];
    if (query.includes('fifth vowel')) return vowels[4];

   
    const simpleContainsMatch = query.match(/containing\s+([a-z])(?:\s|$)/i);
    if (simpleContainsMatch) {
      return simpleContainsMatch[1].toLowerCase();
    }

    return null;
  }

  private validateFilters(filters: ParsedFilters): void {
  
    if (filters.min_length !== undefined && 
        filters.max_length !== undefined && 
        filters.min_length > filters.max_length) {
      throw new UnprocessableEntityException('Query parsed but resulted in conflicting filters: min_length cannot be greater than max_length');
    }

   
  }
}