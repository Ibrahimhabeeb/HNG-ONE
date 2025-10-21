import { StringAnalysisPropertiesDto } from "./stringanalyzerproperties.dto";

// string-analyzer-response.dto.ts

import { IsString, IsNotEmpty, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


export class StringAnalyzerResponse {
    
  
    @IsNotEmpty()
    @IsString()
    id: string;


    @IsNotEmpty()
    @IsString()
    value: string;

    
    @IsNotEmpty()
    @IsDateString()
    created_at: string; 


    @ValidateNested() 
    @Type(() => StringAnalysisPropertiesDto) // Tells class-transformer what class the object should be transformed into
    properties: StringAnalysisPropertiesDto;
}