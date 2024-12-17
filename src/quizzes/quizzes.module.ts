import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { QuizzesRepository } from './quizzes.repository';

@Module({
  controllers: [QuizzesController],
  providers: [PrismaService, QuizzesService, QuizzesRepository],
})
export class QuizzesModule {}
