import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entity/Category';
import { Repository } from 'typeorm';
import { CreateCategory } from '../dtos/CreateCategory';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  findAllCategory() {
    return this.categoryRepository.find();
  }

  async createCategory(category: CreateCategory) {
    await this.categoryRepository.create(category);
    return HttpStatus.OK;
  }

  async updateCategory(id: number, category: CreateCategory) {
    await this.categoryRepository.update(id, category);
    return HttpStatus.OK;
  }

  async deleteCategory(id: number) {
    await this.categoryRepository.delete({ id });
    return HttpStatus.OK;
  }
}
