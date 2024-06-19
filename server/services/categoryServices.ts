import mongoose from "mongoose";
import categoryModel,{ CategoryModel } from "../db/models/categoryModel";
import { checkCategory } from "../db/schemas/category";

class CategoryService {
  categoryModel: CategoryModel;
  constructor(categoryModel:CategoryModel) {
    this.categoryModel = categoryModel;
  }
  async createCategory(categoryData: checkCategory) { 
    const newCategory = await this.categoryModel.createCategory(categoryData);
    return newCategory;
  }

  async confirmAllCategories() { // 전체 카테고리 조회
    const users = await this.categoryModel.findAllCategories()
    return users;
  }
  async updateCategory(_id:mongoose.Types.ObjectId, categoryData:checkCategory) {
    if (!_id) return { status: 404, err: '작업에 필요한 ID가 없습니다.' }
    const foundCategory = await this.categoryModel.updateCategory(_id,categoryData);
    if (!foundCategory) return { status: 404, err: '작업에 필요한 카테고리가 없습니다.' }
    return foundCategory;
  }
  async deleteCategoryReal(_id:string) {
    const deleteUser = await this.categoryModel.deleteCategory(_id);
    return deleteUser;
  }
}

const categoryService = new CategoryService(categoryModel);
export default categoryService;