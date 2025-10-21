import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type StringAnalysisDocument = StringAnalysis & Document;

@Schema({timestamps: true})
export class StringAnalysis {

  @Prop({ required: true })
  original_string: string;

  @Prop({ required: true })
  length: number;

    @Prop({ required: true })
    is_palindrome: boolean;

  @Prop({ required: true })
  unique_characters: number;

  @Prop({ required: true })
  word_count: number;

  @Prop({ required: true, unique: true, index: true })
  sha256_hash: string;

  @Prop({ type: Object, required: true })
    character_frequency_map: Record<string, number>; 
    
    public createdAt?: Date;
public updatedAt?: Date;
}

export const StringAnalysisSchema = SchemaFactory.createForClass(StringAnalysis);