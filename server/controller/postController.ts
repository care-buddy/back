import postService from '../services/postServices';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
class PostController {
  async joinPost(req: Request, res: Response) {
      const datas = req.body;
      const post = await postService.createPost(datas)
      res.status(201).json({ success: true, data: post });
  }

  async updatePost(req: Request, res: Response) {
      const { _id } = req.params;
      const postData = req.body;
      const objectId = new mongoose.Types.ObjectId(_id)
      const updatePost = await postService.updatePost(objectId, postData);
      res.status(200).json({ success: true, data:updatePost });
  }

  async deletePost(req: Request, res: Response) {
      const { _id } = req.params;
      const {deletedAt, ...postData} = req.body;
      const objectId = new mongoose.Types.ObjectId(_id)
      const deletePost = await postService.updatePost(objectId, {...postData, deletedAt:new Date()});
      res.status(200).json({ success: true, data:deletePost });
  }

  async confirmPost(req: Request, res: Response) {
			const { _id } = req.params
			const post = await postService.confirmUserPosts(_id)
			res.status(200).json({ success: true, message: post });
  }
	// 전체 글 확인
	async confirmAllPost(req: Request, res: Response) {
			const posts = await postService.confirmAllPosts()
			res.status(200).json({ success: true, message: posts });
  }
  // 실제 글 삭제 (사용하지 않음)
  async deletePostReal(req: Request, res: Response) {
    const { _id } = req.params
    await postService.deletePostReal(_id)
    res.status(200).json({ message: "글 삭제가 완료되었습니다(사용할 기능 아님)" });
  }
  async likeHandle(req: Request, res: Response) {
    const { _id } = req.params
    const { userId } = req.body
    const like = await postService.likeChange(_id, userId)
    res.status(200).json({ success: true, message: like });
  }

  // 프로필 사진 등록
  async putPostImage(req: Request, res: Response) {
    try {
      const { _id } = req.params;
      const postImage = req.file?.filename;
      const objectId = new mongoose.Types.ObjectId(_id);
      const result = await postService.updatePostImage(objectId, postImage);
      console.log(result)
      res.status(200).json({ message: "이미지가 수정되었습니다.", data: result });
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ message: "서버의 postContrller에서 에러가 났습니다." });
    }
  }

  // 프로필 사진 삭제
  async deletePostImage(req: Request, res: Response) {
    try {
      const { _id } = req.params;
      const postImage = `public/image/defaultImage.png`;
      const objectId = new mongoose.Types.ObjectId(_id);
      const result = await postService.updatePostImage(objectId, postImage);
      res.status(200).json({ message: "이미지가 삭제되었습니다.", data: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "서버의 postContrller에서 에러가 났습니다." });
    }
  }
}
const postController = new PostController();
export default postController;
