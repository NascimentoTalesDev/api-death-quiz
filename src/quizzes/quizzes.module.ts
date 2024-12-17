import { Module } from '@nestjs/common';
import { PrismaService } from '@/src/prisma/prisma.service';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from '@/src/quizzes/quizzes.service';
import { QuizzesRepository } from '@/src/quizzes/quizzes.repository';

@Module({
  controllers: [QuizzesController],
  providers: [PrismaService, QuizzesService, QuizzesRepository],
})
export class QuizzesModule {}
