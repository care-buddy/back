import { Router } from "express";
import hospitalController from "../controller/hospitalController";

const hospitalRouter = Router();

// 삭제는 put 으로

hospitalRouter.post( "/", hospitalController.createHospital);
hospitalRouter.get("/", hospitalController.getAllHospital);
hospitalRouter.get("/:_id", hospitalController.getHospitalById);
hospitalRouter.put("/:_id", hospitalController.updateHospital);
hospitalRouter.put("/:_id/d", hospitalController.deleteHospital);

export default hospitalRouter;