import { Router } from "express";
import postController from "../controller/postController";
import upload from "../utils/imageHandler";

const postRouter = Router()
postRouter.get("/",postController.confirmAllPost)
postRouter.post("/", postController.joinPost)
postRouter.get("/:_id",postController.confirmPost)
postRouter.put("/:_id",postController.updatePost) // 수정
postRouter.put("/:_id/w", postController.deletePost); // 삭제
postRouter.delete("/:_id/w", postController.deletePostReal); // 실제로는 사용 안하는 진짜 삭제
postRouter.put("/:_id/like",postController.likeHandle)  // 좋아요

// 프로필 사진 등록
postRouter.post("/:_id/postImage", upload.single("postImage"), postController.putPostImage);
// 프로필 사진 삭제
postRouter.delete("/:_id/postImage", upload.single("postImage"), postController.deletePostImage);

export default postRouter
