import { Router } from "express";
import commentController from "../controller/commentController";

const commentRouter = Router();

commentRouter.post("/", commentController.createComment);   // 댓글 등록
commentRouter.get("/:postId", commentController.getCommentByPostId); // 게시글당 댓글 조회
commentRouter.put("/:_id", commentController.updateComment);  // 댓글 수정
commentRouter.put("/:_id/d", commentController.deleteComment);  // 댓글 삭제

export default commentRouter;
