import { Router } from "express";
import commentController from "../controller/commentController";

const commentRouter = Router();

commentRouter.post("/", commentController.createComment);
commentRouter.get("/", commentController.getAllComments);
commentRouter.get("/:_id", commentController.getCommentByPostId);
commentRouter.put("/:_id", commentController.updateComment);
commentRouter.delete("/:_id", commentController.deleteComment);

export default commentRouter;
