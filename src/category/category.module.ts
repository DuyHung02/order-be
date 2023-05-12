import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entity/Category';
import { CategoryService } from './service/category.service';
import { CategoryController } from './controller/category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
