import { Request, Response } from 'express';
import mongoose, { Schema } from 'mongoose';
import commentService from '../services/commentServices';

class CommentController {
  // 댓글 등록
  async createComment(req: Request, res: Response) {
    try {
      const datas = req.body;
      const comment = await commentService.createComment(datas);

      res.status(201).json({ success: true, data: comment });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 전체 댓글 조회
  async getAllComments(req: Request, res: Response) {
    try {
      const comments = await commentService.getAllComments();
      res.status(200).json({ success: true, message: comments });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 게시글당 댓글 조회
  async getCommentByPostId(req: Request, res: Response) {
    try {
      // req의 params에서 데이터 가져옴
      const { _id } = req.params;
      const objectId = new mongoose.Types.ObjectId(_id);

      const comment = await commentService.getCommentByPostId(objectId);

      res.status(200).json({ success: true, message: comment });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 댓글 수정
  async updateComment(req: Request, res: Response) {
    try {
      // req의 params과 body에서 데이터 가져옴
      const { _id } = req.params;
      const commentData = req.body;

      const objectId = new mongoose.Types.ObjectId(_id);

      const updateComment = await commentService
        .updateComment(objectId, commentData);

      res.status(200).json({ success: true, data: updateComment });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 댓글 삭제
  async deleteComment(req: Request, res: Response) {
    try {
      // req의 params과 body에서 데이터 가져옴
      const { _id } = req.params;
      const objectId = new mongoose.Types.ObjectId(_id);

      const deleteComment = await commentService.deleteComment(objectId);

      res.status(200).json({ success: true, data: deleteComment });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }
}

const commentController = new CommentController();
export default commentController;