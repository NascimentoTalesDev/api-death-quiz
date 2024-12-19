import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsRepository {
  constructor(private prismaService: PrismaService) {}

  async create (createQuestionDto: CreateQuestionDto){
    const { quizId, correctAnswer, question, answers } =  createQuestionDto;

    const createdQuestion = await this.prismaService.question.create({
      data:{
        quizId: +quizId,
        correctAnswer,
        question,
      }
    });

    await Promise.all(answers.map(answer => 
      this.prismaService.answer.create({      
        data:{
          questionId: createdQuestion.id,
          answer : answer.text
        }
      })
    ));

    return createdQuestion
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const { correctAnswer, question, answers } = updateQuestionDto;
  
    // Verificar se a questão existe
    const existingQuestion = await this.prismaService.question.findUnique({
      where: { id },
    });
  
    if (!existingQuestion) {
      throw new Error('Pergunta não encontrada');
    }
  
    try {
      // Atualizar a questão
      const updatedQuestion = await this.prismaService.question.update({
        where: { id },
        data: {
          correctAnswer,
          question
        }
      });
  
      // Excluir as respostas existentes
      await this.prismaService.answer.deleteMany({
        where: {
          questionId: id
        }
      });
  
      // Criar as novas respostas
      await Promise.all(
        answers.map(answer =>
          this.prismaService.answer.create({
            data: {
              questionId: id,
              answer: answer.text
            }
          })
        )
      );
  
      return updatedQuestion;
    } catch (error) {
      console.error('Erro ao atualizar a pergunta:', error);
      throw new Error('Ocorreu um erro ao atualizar a pergunta');
    }
  }
  

  async remove (id: number){    
    await this.prismaService.answer.deleteMany({      
      where:{
        questionId: id
      }
    })

    const deletedQuestion = await this.prismaService.question.delete({
      where:{
        id
      },
    });

    return deletedQuestion
  }
}
