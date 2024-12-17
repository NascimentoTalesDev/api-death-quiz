import { Injectable } from '@nestjs/common';
import { Prisma, Quiz } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuizDto } from 'src/interfaces/dtos/quizzes/create-quiz.dto';

@Injectable()
export class QuizzesRepository {
  constructor(private prismaService: PrismaService) {}

  async findLatestQuizzesAdded(): Promise<Quiz[]> {
    const allQuiz = await this.prismaService.quiz.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 4,
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
        favorites: true,
      },
    });
    return allQuiz;
  }

  async findAllFavorites(userId: number): Promise<Quiz[]> {
    const allQuiz = await this.prismaService.quiz.findMany({
      where: {
        favorites: {
          some: {
            userId,
          },
        },
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
        favorites: true,
      },
    });

    return allQuiz;
  }

  async favorite(quizId: number, userId: number) {
    const isFavorite = await this.prismaService.favorite.findFirst({
      where: {
        userId,
        quizId,
      },
    });
    if (isFavorite) {
      await this.prismaService.favorite.deleteMany({
        where: {
          userId,
          quizId,
        },
      });
      return false;
    } else {
      await this.prismaService.favorite.create({
        data: {
          userId,
          quizId,
        },
      });
      return true;
    }
  }

  async like(quizId: number, userId: number) {
    const isLiked = await this.prismaService.likedQuizzes.findFirst({
      where: {
        userId,
        quizId,
      },
    });
    if (isLiked) {
      await this.prismaService.likedQuizzes.deleteMany({
        where: {
          userId,
          quizId,
        },
      });
      return false;
    } else {
      await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.unLikedQuizzes.deleteMany({
            where: {
              userId,
              quizId,
            },
          });
          await prisma.likedQuizzes.create({
            data: {
              userId,
              quizId,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );
      return true;
    }
  }

  async unLike(quizId: number, userId: number) {
    const isUnLiked = await this.prismaService.unLikedQuizzes.findFirst({
      where: {
        userId,
        quizId,
      },
    });
    if (isUnLiked) {
      await this.prismaService.unLikedQuizzes.deleteMany({
        where: {
          userId,
          quizId,
        },
      });
      return false;
    } else {
      await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.likedQuizzes.deleteMany({
            where: {
              userId,
              quizId,
            },
          });
          await prisma.unLikedQuizzes.create({
            data: {
              userId,
              quizId,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );
      return true;
    }
  }

  async findAllAdmin(): Promise<Quiz[]> {
    try {
      const allQuizzes = await this.prismaService.quiz.findMany({
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
          favorites: true,
        },
      });
      console.log(allQuizzes);
      
      return allQuizzes;
    } catch (error) {
      console.log(error);
    }
  }
  
  async findAll(): Promise<Quiz[]> {
    try {
      const allQuizzes = await this.prismaService.quiz.findMany({
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
          favorites: true,
        },
      });
      console.log(allQuizzes);
      
      return allQuizzes;
    } catch (error) {
      console.log(error);
    }
  }
 
  async findOne(id: number): Promise<Quiz> {
    try {
      const quiz = await this.prismaService.quiz.findUnique({
        where: {
          id,
        },
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
          favorites: true,
          liked: true,
          unLiked: true,
        },
      });

      return quiz;
    } catch (error) {
      return null;
    }
  }

  async create (createQuizDto: CreateQuizDto) : Promise<Quiz>{
    const { image, title  } =  createQuizDto;
    const quiz = await this.prismaService.quiz.create({
      data: {
        image,
        title 
      }
    })

    return quiz
  }
}
