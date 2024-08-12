import mongoose from "mongoose";
import { Comment, checkComment } from "../schemas/comment";
import { Post, checkPost } from "../schemas/post";

export class CommentModel {
  // 댓글 등록
  async createComment(commentData: checkComment) {
    const createNewComment = await Comment.create(commentData);
    return createNewComment;
  }

  // 게시글당 댓글 조회
  async getCommentByPostId(postId: mongoose.Types.ObjectId) {
    const comment = await Comment.find({ postId })
    .populate("userId")
    .populate("postId");
    return comment;
  }

  // 댓글 수정
  async updateComment(_id: mongoose.Types.ObjectId, updateData: checkComment) {
    const comment = await Comment
      .findOneAndUpdate({ _id }, updateData, { new: true })
      .populate('userId')
      .populate('postId');
    return comment;
  }

  // 댓글 삭제
  async deleteComment(_id: mongoose.Types.ObjectId) {
    const deletedComment = await Comment.findOneAndUpdate({ _id }, {deletedAt: new Date()}, { new: true });
    return deletedComment;
  }
  
}

const commentModel = new CommentModel();
export default commentModel;