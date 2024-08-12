import mongoose from "mongoose";
import commentModel, { CommentModel } from "../db/models/commentModel";
import { checkComment } from "../db/schemas/comment";
import { Post } from "../db/schemas/post";
import { User } from "../db/schemas/user";
import ValidationError from "../utils/validationError";

class CommentService {
  commentModel: CommentModel;

  constructor(commentModel: CommentModel) {
    this.commentModel = commentModel;
  }

  // 댓글 등록
  async createComment(commentData: checkComment) {
    const newComment = await this.commentModel.createComment(commentData);
    const newDatas = await newComment.save();
    const user = await User.findById(newDatas.userId);
    const post = await Post.findById(newDatas.postId);
    if (user) {
      user.commentId.push(newComment._id);
      await user.save();
    }
    if (post) {
      post.commentId.push(newComment._id);
      await post.save();
    }
    return newComment;
  }

  // 게시글당 댓글 조회
  async getCommentByPostId(postId: mongoose.Types.ObjectId) {
    const comment = await commentModel.getCommentByPostId(postId);
    return comment;
  }

  // 댓글 수정
  async updateComment(_id: mongoose.Types.ObjectId, commentData: checkComment) {
    if (!_id) return { status: 404, err: '작업에 필요한 ID가 없습니다.' }
    
    const foundComment = await this.commentModel.updateComment(_id, commentData);
    if (!foundComment) return { status: 404, err: '작업에 필요한 댓글이 없습니다.' }

    await User.find({ commentId: { $elemMatch: { $eq: _id } } });
    
    return foundComment;
  }

  // 댓글 삭제
  async deleteComment(_id: mongoose.Types.ObjectId) {
    const foundComment = await this.commentModel.deleteComment(_id);
    if (!foundComment) return { status: 404, err: '작업에 필요한 댓글이 없습니다.' }
    
    return foundComment;
  }

}
const commentService = new CommentService(commentModel);
export default commentService;