import { Injectable } from '@nestjs/common';
import { Prisma, Quiz } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Query } from 'express-serve-static-core'
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizzesRepository {
  constructor(private prismaService: PrismaService) { }

  async search(query: Query) {
    const quizzesFinded = await this.prismaService.quiz.findMany({
      where: {
        title: {
          contains: query.search_query as string,
        }
      },
      orderBy: {
        createdAt: 'asc'
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
    return quizzesFinded;
  }

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

  async searchFavorites(query: Query) {
    const quizzesFinded = await this.prismaService.quiz.findMany({
      where: {
        title: {
          contains: query.search_query as string,
        },
        favorites: {
          some: {
            userId: parseInt(query.userId as string),
          },
        },
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    return quizzesFinded;
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

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const { image, title } = createQuizDto;
    const quiz = await this.prismaService.quiz.create({
      data: {
        image,
        title
      }
    })

    return quiz
  }

  async update(id: number, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const { image, title } = updateQuizDto;    
    const quizUpdated = await this.prismaService.quiz.update({
      where:{
        id
      },
      data: {
        title,
        image
      },
    })

    return quizUpdated
  }

  async remove(id: number): Promise<Quiz> {
    const question = await this.prismaService.question.findFirst({
      where: {
        quizId: id,
      },
    });
  
    if (question) {
      const answersExist = await this.prismaService.answer.findMany({
        where: {
          questionId: question.id,
        },
      });
  
      if (answersExist.length > 0) {
        await this.prismaService.answer.deleteMany({
          where: {
            questionId: question.id,
          },
        });
      }
  
      await this.prismaService.question.deleteMany({
        where: {
          quizId: id,
        },
      });
    }
  
    const quizDeleted = await this.prismaService.quiz.delete({
      where: {
        id,
      },
    });
  
    return quizDeleted;
  }
  
}
