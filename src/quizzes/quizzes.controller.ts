import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Controller('quizzes')
@ApiTags("Quizzes")
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get("latest")
  async findLatestQuizzesAdded() {
    return await this.quizzesService.findLatestQuizzesAdded();
  }

  @Get('favorites')
  async findAllFavorites(@Query('userId') userId: string) {        
    return await this.quizzesService.findAllFavorites(+userId);
  }

  @Post("favorite")
  async favorite (@Query('quizId') quizId: string, @Query('userId') userId: string ){
    const favoriteUpdated = await this.quizzesService.favorite(+quizId, +userId)
    return favoriteUpdated
  }
  
  @Post("like")
  async like (@Query('quizId') quizId: string, @Query('userId') userId: string ){
    const likeUpdated = await this.quizzesService.like(+quizId, +userId)
    return likeUpdated
  }

  @Post("unlike")
  async unLike (@Query('quizId') quizId: string, @Query('userId') userId: string ){
    const unLikeUpdated = await this.quizzesService.unLike(+quizId, +userId)
    return unLikeUpdated
  }

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {    
    return this.quizzesService.create(createQuizDto);
  }

  @Get("admin")
  async findAllAdmin() {
    return await this.quizzesService.findAllAdmin();
  }

  @Get()
  async findAll() {
    return await this.quizzesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {    
    return this.quizzesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {    
    return this.quizzesService.update(+id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(+id);
  }
}
