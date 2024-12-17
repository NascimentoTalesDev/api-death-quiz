import { Injectable } from '@nestjs/common';
import { QuizzesRepository } from './quizzes.repository';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private quizzesRepository: QuizzesRepository) {}

  async findLatestQuizzesAdded() {
    return await this.quizzesRepository.findLatestQuizzesAdded();
  }

  async findAllFavorites(userId: number) {
    return await this.quizzesRepository.findAllFavorites(userId);
  }

  async favorite(quizId: number, userId: number) {
    return  await this.quizzesRepository.favorite(quizId, userId);
  }

  async like(quizId: number, userId: number) {
    return await this.quizzesRepository.like(quizId, userId);
  }

  async unLike(quizId: number, userId: number) {
    return await this.quizzesRepository.unLike(quizId, userId);
  }
  async create(createQuizDto: CreateQuizDto) {        
    return await this.quizzesRepository.create(createQuizDto);
  }

  async findAllAdmin() {
    return await this.quizzesRepository.findAllAdmin();
  }
  async findAll() {
    return await this.quizzesRepository.findAll();
  }

  async findOne(id: number) {
    return await this.quizzesRepository.findOne(id);
  }

  async update(id: number, updateQuizDto: UpdateQuizDto) { 

    return `This action update a #${id} quiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
