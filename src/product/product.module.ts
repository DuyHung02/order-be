import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/Product';
import { Category } from '../category/entity/Category';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  providers: [
    ProductService,
  ],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
