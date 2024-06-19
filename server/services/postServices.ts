import mongoose from "mongoose";
import postModel,{PostModel} from "../db/models/postModel";
import { checkPost } from "../db/schemas/post";
import { User } from "../db/schemas/user";
class PostService {
  postModel: PostModel;
  constructor(postModel:PostModel) {
    this.postModel = postModel;
  }
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

  async confirmAllPosts() { // 전체 카테고리 조회
    const posts = await this.postModel.findAllPosts()
    return posts;
  }
  async confirmUserPosts(_id:string) {
    const posts = await this.postModel.findById(_id)
    return posts;
  }
  async updatePost(_id:mongoose.Types.ObjectId, postData:checkPost) {
    if (!_id) return { status: 404, err: '작업에 필요한 ID가 없습니다.' }

    const foundPost = await this.postModel.updatePost(_id,postData);
    if (!foundPost) return { status: 404, err: '작업에 필요한 게시물이 없습니다.' }

    const users = await User.find({ postId: _id });
    console.log(users)
  //   users.forEach(async (user:any) => {
  //     // 해당 Buddy의 정보를 업데이트합니다.
  //     if (postData.postImage) user.postImage = postData.postImage
  //     if (postData.title) user.postId.title = postData.title
  //     if (checkBuddy.sex) user.sex = checkBuddy.sex;
  //     if (checkBuddy.kind) user.kind = checkBuddy.kind;
  //     if (checkBuddy.weight) user.weight = checkBuddy.weight;
  //     if (checkBuddy.isNeutered !== undefined) user.isNeutered = checkBuddy.isNeutered;
  //     await user.save();
  // })
    return foundPost;
  }

  async deletePostReal(_id:string) {
    const deletePost = await this.postModel.deleteReal(_id);
    return deletePost;
  }
  async likeChange(_id: string, userId: mongoose.Types.ObjectId) {
    const likeChange = await this.postModel.likeChange(_id,userId)
    return likeChange
  }

  // 사진 등록
  async updatePostImage(_id: mongoose.Types.ObjectId, postImage?: string) {
    console.log(`${_id}의 사진을 수정합니다. [Service]`);
    const result = await this.postModel.updatePostImage(_id, postImage);
    return result;
  }
}

const postService = new PostService(postModel);
export default postService;