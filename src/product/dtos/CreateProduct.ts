import { Category } from "../../category/entity/Category";

export class CreateProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  is_active: boolean;
  categoryId: number;
  category: Category
}
