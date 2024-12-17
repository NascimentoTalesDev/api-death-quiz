import { Module } from '@nestjs/common';
import { PrismaService } from '@/src/prisma/prisma.service';
import { QuizzesController } from '@/src/interface/controllers/quizzes/quizzes.controller';
import { QuizzesService } from '@/src/domain/services/quizzes/quizzes.service';
import { QuizzesRepository } from '@/src/domain/repositories/quizzes/quizzes.repository';

@Module({
  controllers: [QuizzesController],
  providers: [PrismaService, QuizzesService, QuizzesRepository],
})
export class QuizzesModule {}
