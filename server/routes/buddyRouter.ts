import { Router } from "express";
import buddyController from "../controller/buddyController";
import upload from "../utils/imageHandler";

const buddyRouter = Router();

// 삭제는 put 으로

buddyRouter.post("/", buddyController.createBuddy);  // 반려동물 등록
buddyRouter.get("/:userId", buddyController.getAllBuddy);    // 회원의 모든 반려동물 조회
buddyRouter.get("/:_id", buddyController.getBuddyById);   // 회원의 반려동물 1마리 조회
buddyRouter.put("/:_id", buddyController.updateBuddy);    // 반려동물 정보 수정
buddyRouter.put("/:_id/d", buddyController.deleteBuddy);    // 반려동물 삭제

// 프로필 사진 등록
buddyRouter.post("/:_id/buddyImage", upload.single("buddyImage"), buddyController.putBuddyImage);
// 프로필 사진 삭제
buddyRouter.delete("/:_id/buddyImage", upload.single("buddyImage"), buddyController.deleteBuddyImage);


export default buddyRouter;
 