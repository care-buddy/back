import { Router } from "express";
import categoryController from "../controller/categoryController";
const categoryRouter = Router();
categoryRouter.get("/", categoryController.confirmAllCategories);
categoryRouter.post( "/",categoryController.createCategory);
categoryRouter.put("/:_id", categoryController.updateCategory);
categoryRouter.delete("/:_id", categoryController.deleteCategoryReal);

export default categoryRouter
