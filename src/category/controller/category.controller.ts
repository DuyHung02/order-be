import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { CreateCategory } from '../dtos/CreateCategory';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('find/all')
  findAllCategory() {
    return this.categoryService.findAllCategory();
  }

  @Post('create')
  createCategory(@Body() category: CreateCategory) {
    return this.categoryService.createCategory(category);
  }

  @Put('update/:id')
  updateCategory(
    @Body() category: CreateCategory,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.categoryService.updateCategory(id, category);
  }

  @Delete('delete/:id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
