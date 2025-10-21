import { IsNotEmpty, IsString } from "class-validator";


export class StringAnalyzerRequest{
    @IsNotEmpty()
    @IsString()
   value: string
   

}