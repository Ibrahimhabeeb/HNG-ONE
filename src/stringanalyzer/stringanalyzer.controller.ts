import { response } from "express";
import { StringAnalyzerRequest } from "./dtos/stringanalyzerrequest.dto";
import { StringAnalyzerResponse } from "./dtos/stringanalyzerresponse.dto";
import { StringAnalyzerService } from "./stringanalyzer.service";
import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
    Get,
    Injectable,
  Param,
  Query,
  BadRequestException,
  Delete
} from '@nestjs/common';
import { GetStringsFilterDto } from "./dtos/stringanalyzerqueryfilter.dto";
import { filter } from "rxjs";
import { NaturalLanguageParserService } from "./naturallanguageparser.service";
@Injectable()
@Controller("strings")
export class StringAnalyzerController{

    constructor(
        private readonly stringAnalyzerService: StringAnalyzerService,
        private readonly nlpService : NaturalLanguageParserService
    ) {
         
    }

    @Post()
   async createString(@Body() request: StringAnalyzerRequest){
      return await  this.stringAnalyzerService.createString(request.value);
            
    }

     @Get('filter-by-natural-language') 
    async filterbyNaturalLanguage(@Query('query') query: string ) {
      if (!query) {
          throw new BadRequestException("no query parameters");

             }
              const parsedFilters = this.nlpService.parseQuery(query);

    
             const filteredStrings = await this.stringAnalyzerService.filterByParsedQuery(query,parsedFilters);

     return {
      data: filteredStrings,
      count: filteredStrings.count,
      interpreted_query: {
        original: query,
        parsed_filters: parsedFilters,
      },
    };
    }
    
    @Get("/:stringValue")
   async getSpecificString(@Param("stringValue") stringValue: string) {
      return  await  this.stringAnalyzerService.getSpecificString(stringValue);
        
    }
    
    @Get()
    async getStringwithQueryFilters(@Query() filters: GetStringsFilterDto) {
        console.log(filters);
      return await this.stringAnalyzerService.getStringswithFiltering(filters);
        

   
    }
    



    @Delete("/:stringValue")
    @HttpCode(204)
        async deleteString(@Param('stringValue')  stringValue:string ) {
            await this.stringAnalyzerService.deleteString(stringValue);


        }



        }


