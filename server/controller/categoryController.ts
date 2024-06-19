import categoryService from '../services/categoryServices';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
class CategoryController {
  async createCategory(req: Request, res: Response) {
    const datas = req.body;
    const category = await categoryService.createCategory(datas)
    res.status(201).json({ success: true, data: category });
  }
  async updateCategory(req: Request, res: Response) {
    const { _id } = req.params;
    const datas = req.body;
    const objectId = new mongoose.Types.ObjectId(_id)
    const category = await categoryService.updateCategory(objectId, datas);
    res.status(200).json({ success: true, data: category });
  }
	async confirmAllCategories(req: Request, res: Response) {
		const categories = await categoryService.confirmAllCategories()
		res.status(200).json({ success: true, message: categories });
  }
  async deleteCategoryReal(req: Request, res: Response) {
    const { _id } = req.params
    await categoryService.deleteCategoryReal(_id)
    res.status(200).json({ success: true });
  }
}
const categoryController = new CategoryController();
export default categoryController;