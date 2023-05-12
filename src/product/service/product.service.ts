import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "../entity/Product";
import { Repository } from "typeorm";
import { CreateProduct } from "../dtos/CreateProduct";
import { Category } from "../../category/entity/Category";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  findProducts() {
    return this.productRepository.find({
      relations: ['category'],
      // where: { is_active: true },
    });
  }

  findAllProduct() {
    return this.productRepository.find({
      relations: ['category']
    });
  }

  async findProductByCategory(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    return this.productRepository.findBy({ category });
  }

  findProductByName(name: string) {
    return `${name}waiting...`;
  }

  async createProduct(product: CreateProduct) {
    const id = product.categoryId;
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new HttpException('Category found found', HttpStatus.BAD_REQUEST);
    }
    const newProduct = {
      name: product.name,
      price: product.price,
      image: product.image,
      category: category,
      is_active: true,
    };
    await this.productRepository.save(newProduct);
    return HttpStatus.OK;
  }

  async findProductById(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new HttpException('Không tìm thấy món', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async updateProduct(product: CreateProduct) {
    const id = product.id
    const categoryId = product.categoryId
    product.category = await this.categoryRepository.findOneBy({ id: categoryId })
    delete product.categoryId
    await this.productRepository.update(id, { ...product });
    return HttpStatus.OK;
  }

  async deleteProduct(id: number) {
    await this.productRepository.delete({ id });
    return HttpStatus.OK;
  }
}
