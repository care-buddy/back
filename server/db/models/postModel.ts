import mongoose from "mongoose";
import { Post, checkPost } from "../schemas/post";
export class PostModel {
  async findAllPosts() {
    const posts = await Post.find({}).populate('userId').populate('categoryId')
    return posts;
  }
  async findById(_id:string) {
    const posts = await Post.find({_id}).populate('userId').populate('categoryId')
    return posts
  } // 글에서 유저에 대한 정보와 어느 카테고리에 속한지를 보여주고 싶을 때?
  async createPost(postData:checkPost) {
    const user = await Post.create(postData)
    return user;
  }
  async updatePost(_id:mongoose.Types.ObjectId,postData:checkPost) {
    const post = await Post.findOneAndUpdate({_id} , postData, { new: true }).populate('userId').populate('categoryId')
    return post;
  }
  async deleteReal(_id:string) {
    const post = await Post.findOneAndDelete({ _id });
    return post;
  }
  async likeChange(_id: string, userId: mongoose.Types.ObjectId) {
    const post = await Post.findById(_id);
    if (!post) return { status: 404, err: '작업에 필요한 게시글이 없습니다.' }
  
    const alreadyLiked = post.likedUsers.includes(userId);
    let numberOfLikes;
  
    if (alreadyLiked) {
      // 이미 좋아요를 누른 상태이므로 좋아요를 제거
      await Post.findByIdAndUpdate(_id, { $pull: { likedUsers: userId } });
      numberOfLikes = post.likedUsers.length - 1;
    } else {
      // 아직 좋아요를 누르지 않은 상태이므로 좋아요를 추가
      await Post.findByIdAndUpdate(_id, { $push: { likedUsers: userId } });
      numberOfLikes = post.likedUsers.length + 1;
    }
    post.save()
    return numberOfLikes;
  }
  
  // 프로필 사진 등록
  async updatePostImage(_id: mongoose.Types.ObjectId, postImage?: string) {
    const result = await Post.findOneAndUpdate(
      { _id },
      { postImage }, 
      { new: true }
    );
    return result;
  }
}
const postModel = new PostModel()
export default postModel 