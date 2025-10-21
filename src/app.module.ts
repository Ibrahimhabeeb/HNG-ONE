import { Module } from '@nestjs/common';
import { StringanalyzerModule } from './stringanalyzer/stringanalyzer.module';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [StringanalyzerModule,MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/mydb'), ConfigModule.forRoot({
      isGlobal: true,
    }),],
  controllers: [],
  providers: [],
})
export class AppModule {



}
