import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ProductService } from "../service/product.service";
import { CreateProduct } from "../dtos/CreateProduct";
import { Roles } from "../../user/roles.decorator";
import { Role } from "../../user/entity/role.enum";
import { SkipAuth } from "../../auth/auth.decorator";

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

  @Get('find/all/active/off')
  findProductsActiveOff() {
    return this.productService.findProductsActiveOff()
  }

  @SkipAuth()
  @Get('find/all/active/on')
  findProductsActiveOn() {
    return this.productService.findProductsActiveOn()
  }

  @Roles(Role.ADMIN)
  @Post("create")
  createProduct(@Body() product: CreateProduct) {
    return this.productService.createProduct(product);
  }

  @Roles(Role.ADMIN)
  @Post("update")
  updateProduct(
    @Body() product: CreateProduct) {
    return this.productService.updateProduct(product);
  }

  @Roles(Role.ADMIN)
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
