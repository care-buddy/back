import mongoose from "mongoose";
import { Category, checkCategory } from "../schemas/category";
export class CategoryModel {
  async findAllCategories() {
    const users = await Category.find({});
    return users;
  }
  async updateCategory(_id:mongoose.Types.ObjectId,categoryData:checkCategory) {
    const updatedCategory = await Category.findOneAndUpdate({ _id },categoryData, { new: true });
    return updatedCategory;
  }
  async deleteCategory(_id:string) {
    const result = await Category.deleteOne({ _id});
    return result;
  }
  async createCategory(categoryData:checkCategory) {
    const createNewCategory = await Category.create(categoryData);
    return createNewCategory;
  }
  async findByCategoryId(_id: string) {
    const user = await Category.findOne({ _id });
    return user;
  }

}
const categoryModel = new CategoryModel()
export default categoryModel