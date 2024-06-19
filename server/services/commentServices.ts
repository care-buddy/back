import mongoose from "mongoose";
import commentModel, { CommentModel } from "../db/models/commentModel";
import { checkComment } from "../db/schemas/comment";
import ValidationError from "../utils/validationError";

class CommentService {
  commentModel: CommentModel;

  constructor(commentModel: CommentModel) {
    this.commentModel = commentModel;
  }

  // 댓글 등록
  async createComment(commentData: checkComment) {
    const newHComment = await this.commentModel.createComment(commentData);
    return newHComment;
  }

  // 전체 댓글 조회
  async getAllComments() {
    const comments = await this.commentModel.findAll();
    return comments;
  }

  // 게시글당 댓글 조회
  async getCommentByPostId(_id: mongoose.Types.ObjectId) {
    const comment = await commentModel.getCommentByPostId(_id);
    return comment;
  }

  // 댓글 수정
  async updateComment(_id: mongoose.Types.ObjectId, commentData: checkComment) {
    if (!_id) return { status: 404, err: '작업에 필요한 ID가 없습니다.' }
    
    const foundComment = await this.commentModel.updateComment(_id, commentData);

    if (!foundComment) return { status: 404, err: '작업에 필요한 댓글이 없습니다.' }
    
    return foundComment;
  }

  // 댓글 삭제
  async deleteComment(_id: mongoose.Types.ObjectId) {
    const foundHospital = await this.commentModel.deleteComment(_id);
    if (!foundHospital) return { status: 404, err: '작업에 필요한 병원 진료기록이 없습니다.' }
    
    return foundHospital;
  }

}
const commentService = new CommentService(commentModel);
export default commentService;