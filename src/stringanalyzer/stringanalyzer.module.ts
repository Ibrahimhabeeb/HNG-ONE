import { Module } from '@nestjs/common';
import { StringAnalyzerController } from './stringanalyzer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
    StringAnalysis,
 StringAnalysisSchema
 } from './schemas/string.schema';
import { StringAnalyzerService } from './stringanalyzer.service';
import { NaturalLanguageParserService } from './naturallanguageparser.service';

@Module({
    controllers: [StringAnalyzerController],
    providers: [StringAnalyzerService, NaturalLanguageParserService],
    imports: [
        MongooseModule.forFeature([
      { name: StringAnalysis.name, schema: StringAnalysisSchema },
    ]),
    ]
    

}

)
export class StringanalyzerModule {}
