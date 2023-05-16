import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { CategoryService } from "../service/category.service";
import { CreateCategory } from "../dtos/CreateCategory";
import { Roles } from "../../user/roles.decorator";
import { Role } from "../../user/entity/role.enum";

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('find/all')
  findAllCategory() {
    return this.categoryService.findAllCategory();
  }

  @Roles(Role.ADMIN)
  @Get('find/:id')
  findCategoryById(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoryService.findCategoryById(categoryId)
  }

  @Roles(Role.ADMIN)
  @Post('create')
  createCategory(@Body() category: CreateCategory) {
    return this.categoryService.createCategory(category);
  }

  @Roles(Role.ADMIN)
  @Post('update')
  updateCategory(@Body() category: CreateCategory) {
    return this.categoryService.updateCategory(category);
  }

  @Delete('delete/:id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
