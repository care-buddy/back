import { Router } from "express";
import buddyController from "../controller/buddyController";
import upload from "../utils/imageHandler";

const buddyRouter = Router();

// 삭제는 put 으로

buddyRouter.post( "/", buddyController.createBuddy);
buddyRouter.get("/", buddyController.getAllBuddy);
buddyRouter.get("/:_id", buddyController.getBuddyById);
buddyRouter.put("/:_id", buddyController.updateAndDeleteBuddy);
buddyRouter.delete("/:_id", buddyController.deleteBuddy);

// 프로필 사진 등록
buddyRouter.post("/:_id/buddyImage", upload.single("buddyImage"), buddyController.putBuddyImage);
// 프로필 사진 삭제
buddyRouter.delete("/:_id/buddyImage", upload.single("buddyImage"), buddyController.deleteBuddyImage);


export default buddyRouter;
