import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put
} from "@nestjs/common";
import { ProductService } from "../service/product.service";
import { CreateProduct } from "../dtos/CreateProduct";

@Controller("products")
export class ProductController {
  constructor(private productService: ProductService) {
  }

  @Get("find/all")
  findProducts() {
    return this.productService.findProducts();
  }

  @Get("find/:id")
  findProductById(@Param("id", ParseIntPipe) id: number) {
    return this.productService.findProductById(id);
  }

  @Post("create")
  createProduct(@Body() product: CreateProduct) {
    return this.productService.createProduct(product);
  }

  @Post("update")
  updateProduct(
    @Body() product: CreateProduct
  ) {
    return this.productService.updateProduct(product);
  }

  @Delete("delete/:id")
  deleteProduct(@Param("id", ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }

  @Get("find/by/category/:id")
  findProductByCategory(@Param("id", ParseIntPipe) id: number) {
    return this.productService.findProductByCategory(id);
  }

  @Get("find/by/:name")
  findProductByName(@Param("name") name: string) {
    return this.productService.findProductByName(name);
  }

  @Get("test")
  test() {
    return "hello test";
  }
}
