import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { QuizzesModule } from './app/quizzes/quizzes.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, QuizzesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
