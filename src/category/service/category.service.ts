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

  findCategoryById(categoryId: number) {
    return this.categoryRepository.findOneBy({id: categoryId})
  }

  async createCategory(category: CreateCategory) {
    await this.categoryRepository.save(category);
    return this.findAllCategory()
  }

  async updateCategory(category: CreateCategory) {
    const categoryId = category.id
    await this.categoryRepository.update(categoryId, category);
    return this.findAllCategory()
  }

  async deleteCategory(id: number) {
    await this.categoryRepository.delete({ id });
    return HttpStatus.OK;
  }
}
