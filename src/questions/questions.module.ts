import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { QuestionsRepository } from './questions.repository';

@Module({
  controllers: [QuestionsController],
  providers: [PrismaService, QuestionsService, QuestionsRepository],

})
export class QuestionsModule {}
