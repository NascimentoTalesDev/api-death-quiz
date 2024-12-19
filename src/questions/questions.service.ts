import { Injectable } from '@nestjs/common';
import { QuestionsRepository } from './questions.repository';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private questionsRepository: QuestionsRepository) {}

  async create(createQuestionDto: CreateQuestionDto) {
    return await this.questionsRepository.create(createQuestionDto);
  }

  findAll() {
    return `This action returns all questions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return await this.questionsRepository.update(id, updateQuestionDto);
  }

  async remove(id: number) {
    return await this.questionsRepository.remove(id);
  }
}
