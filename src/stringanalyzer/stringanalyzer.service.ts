import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { StringAnalyzerRequest } from "./dtos/stringanalyzerrequest.dto";
import { StringAnalyzerResponse } from "./dtos/stringanalyzerresponse.dto";
import { InjectModel } from "@nestjs/mongoose";
import { StringAnalysis } from "./schemas/string.schema";
import { Model } from "mongoose";
import * as crypto from 'crypto';
import { StringAnalysisDocument } from "./schemas/string.schema";
import { StringAnalysisPropertiesDto } from "./dtos/stringanalyzerproperties.dto";
import { GetStringsFilterDto } from "./dtos/stringanalyzerqueryfilter.dto";



@Injectable()
export class StringAnalyzerService{

    constructor(
    @InjectModel(StringAnalysis.name)
    private readonly stringAnalysisModel: Model<StringAnalysisDocument>,

  ) {}
    async createString(request: string): Promise<StringAnalyzerResponse> {
        const exists = await this.stringAnalysisModel.findOne({
            original_string : request
        }).exec();
        if (exists) {
            throw new ConflictException(`String ${exists.original_string} already exists `);
        }
        const properties: StringAnalysisPropertiesDto = this.computeProperties(request);

        const newString = new this.stringAnalysisModel({
            original_string: request,
            length: properties.length,
            is_palindrome: properties.is_palindrome,
            unique_characters: properties.unique_characters,
            word_count: properties.word_count,
            character_frequency_map: properties.character_frequency_map,
            sha256_hash : properties.sha256_hash

        });

         const savedString  = await newString.save();
        return  {
            id: properties.sha256_hash,
            value: request,
            properties: properties,
            created_at :  savedString.createdAt!.toISOString()
    }
      
  }

    
    private computeProperties(inputString: string): StringAnalysisPropertiesDto
    {
        const length = inputString.length;
        const sha256_hash = crypto
      .createHash('sha256')
      .update(inputString)
            .digest('hex');
        const normalized = inputString.toLowerCase().replace(/[^a-z0-9]/g, '');
        const reversed = normalized.split('').reverse().join('');
        const is_palindrome = normalized.length > 0 && normalized === reversed;
        const unique_characters = new Set(inputString).size;
    const word_count = inputString.trim()
      ? inputString.trim().split(/\s+/).length
      : 0;

    const character_frequency_map: Record<string, number> = {};
    for (const char of inputString) {
      character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
        }
    return {
      length,
      is_palindrome,
      unique_characters,
      word_count,
      sha256_hash,
      character_frequency_map
    };

    }

    async getSpecificString(requestString: string) :Promise<StringAnalyzerResponse>  {
         const exists: StringAnalysisDocument | null = await this.stringAnalysisModel.findOne({
          original_string : requestString
         }).exec();
      if (!exists) {
    throw new NotFoundException(`String analysis for "${requestString}" not found.`);
}


   return {
    id: exists.sha256_hash,
    value: exists.original_string,
    created_at: exists.createdAt!.toISOString(),
    properties : {
        length: exists.length,
        is_palindrome: exists.is_palindrome,
        unique_characters: exists.unique_characters,
        word_count: exists.word_count,
        sha256_hash: exists.sha256_hash,
        character_frequency_map: exists.character_frequency_map,
    }
}

    }


    async getStringswithFiltering(filters: GetStringsFilterDto) {
    const query: any = {};

    if (filters.is_palindrome !== undefined)
      query.is_palindrome = filters.is_palindrome;

    if (filters.min_length || filters.max_length) {
      query.length = {};
      if (filters.min_length) query.length.$gte = filters.min_length;
      if (filters.max_length) query.length.$lte = filters.max_length;
        }

         if (filters.word_count !== undefined)
      query.word_count = filters.word_count;

    if (filters.contains_character)
      query.value = { $regex: filters.contains_character, $options: 'i' };

        const data = await this.stringAnalysisModel.find(query).lean();
        return {
      data: data.map(d => ({
        id: d.sha256_hash,
        value: d.original_string ,
        properties: {
          is_palindrome: d.is_palindrome,
          length: d.length,
          word_count: d.word_count,
         character_frequency_map: d.character_frequency_map,
            unique_characters: d.unique_characters,
          sha256_hash : d.sha256_hash
          
        },
        created_at: d.createdAt!.toISOString(),
      })),
      count: data.length,
      filters_applied: filters,
    };
    }




    
  async filterByParsedQuery(original: string, parsedFilters: Record<string, any>) {

    const query: any = {};

    if (parsedFilters.is_palindrome !== undefined)
      query.is_palindrome = parsedFilters.is_palindrome;

    if (parsedFilters.word_count !== undefined)
      query.word_count = parsedFilters.word_count;

    if (parsedFilters.length !== undefined)
      query.length = parsedFilters.length;

    if (parsedFilters.min_length !== undefined || parsedFilters.max_length !== undefined) {
      query.length = {};
      if (parsedFilters.min_length) query.length.$gte = parsedFilters.min_length;
      if (parsedFilters.max_length) query.length.$lte = parsedFilters.max_length;
    }

    if (parsedFilters.contains_character) {
      query.original_string = {
        $regex: parsedFilters.contains_character,
        $options: 'i',
      };
    }

    if (parsedFilters.unique_characters) {
      query.unique_characters = parsedFilters.unique_characters;
    }

  
    const results = await this.stringAnalysisModel.find(query).lean();

    
    return {
      data: results.map((r) => ({
        id: r._id.toString(),
        original_string: r.original_string,
        length: r.length,
        is_palindrome: r.is_palindrome,
        word_count: r.word_count,
        unique_characters: r.unique_characters,
        character_frequency_map: r.character_frequency_map,
        created_at: r.createdAt?.toISOString(),
      })),
      count: results.length,
      interpreted_query: {
        original,
        parsed_filters: parsedFilters,
      },
    };
  }
      
    
   async deleteString(stringValue: string): Promise<void> {
    const result = await this.stringAnalysisModel.deleteOne({
      original_string: stringValue,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException(`String '${stringValue}' not found.`);
    }

   
  }

   

}