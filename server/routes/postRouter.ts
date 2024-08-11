import { Router } from "express";
import postController from "../controller/postController";
import upload from "../utils/imageHandler";

const postRouter = Router()
postRouter.post("/", postController.createPost);   // 글 생성
postRouter.get("/", postController.confirmAllPost);   // 유저의 글 전체 조회
postRouter.get("/:_id", postController.confirmPost);    // 글 하나 조회
postRouter.put("/:_id", postController.updatePost); // 수정
postRouter.put("/:_id/d", postController.deletePost); // 삭제

postRouter.put("/:_id/like", postController.likeHandle)  // 좋아요

// 프로필 사진 등록
postRouter.post("/:_id/postImage", upload.single("postImage"), postController.putPostImage);
// 프로필 사진 삭제
postRouter.delete("/:_id/postImage", upload.single("postImage"), postController.deletePostImage);

export default postRouter
