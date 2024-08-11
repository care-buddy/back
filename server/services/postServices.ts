import mongoose from "mongoose";
import postModel, { PostModel } from "../db/models/postModel";
import { checkPost } from "../db/schemas/post";
import { User, checkUser } from '../db/schemas/user';
import userModel, { UserModel } from '../db/models/userModel';

class PostService {
  postModel: PostModel;
  userModel: UserModel;

  constructor(postModel: PostModel, userModel: UserModel) {
    this.postModel = postModel;
    this.userModel = userModel;
  }

  // 글 생성
  async createPost(postData: checkPost) {
    const newPost = await this.postModel.createPost(postData)
    const newDatas = await newPost.save()
    const user = await User.findById(newDatas.userId);
    if (user) {
      user.postId.push(newPost._id);
      await user.save();
    }
    return newPost;
  }

  // 글 전체 조회
  async confirmAllPosts(userId: mongoose.Types.ObjectId) {
    const user = await this.userModel.findByUserId(userId);
    const posts = await this.postModel.findAllPosts(userId);

    if (!user) {
      return { status: 404, err: '작업에 필요한 유저가 없습니다.' }
    } else if (!posts) {
      return { status: 404, err: '작업에 필요한 게시물이 없습니다.' }
    }
    return posts;
  }

  // 글 하나 조회
  async confirmUserPosts(_id: mongoose.Types.ObjectId) {
    const posts = await this.postModel.findById(_id)
    return posts;
  }

  // 글 수정
  async updatePost(_id: mongoose.Types.ObjectId, postData: checkPost) {
    if (!_id) return { status: 404, err: '작업에 필요한 ID가 없습니다.' }

    const foundPost = await this.postModel.updatePost(_id, postData);
    if (!foundPost) return { status: 404, err: '작업에 필요한 게시물이 없습니다.' }

    const users = await User.find({ postId: { $elemMatch: { $eq: _id } } });
    console.log(users)
    return foundPost;
  }

  // 글 삭제
  async deletePost(_id: mongoose.Types.ObjectId) {
    const deletePost = await this.postModel.deletePost(_id);
    if (!deletePost) return { status: 404, err: '해당 게시물이 없습니다.' }
    return deletePost;
  }
  async likeChange(_id: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
    const likeChange = await this.postModel.likeChange(_id, userId)
    return likeChange
  }

  // 사진 등록
  async updatePostImage(_id: mongoose.Types.ObjectId, postImage?: string) {
    console.log(`${_id}의 사진을 수정합니다. [Service]`);
    const result = await this.postModel.updatePostImage(_id, postImage);
    return result;
  }
}

const postService = new PostService(postModel, userModel);
export default postService;