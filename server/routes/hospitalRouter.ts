import { Router } from "express";
import hospitalController from "../controller/hospitalController";

const hospitalRouter = Router();

// 삭제는 put 으로

hospitalRouter.post( "/", hospitalController.createHospital); // 병원 진료기록 등록
hospitalRouter.get("/:buddyId", hospitalController.getAllHospital);   // 버디의 전체 병원 진료기록 조회
hospitalRouter.get("/:_id", hospitalController.getHospitalById);  // 병원 진료기록 하나 조회
hospitalRouter.put("/:_id", hospitalController.updateHospital);
hospitalRouter.put("/:_id/d", hospitalController.deleteHospital);

export default hospitalRouter; 