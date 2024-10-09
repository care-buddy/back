import { Router } from 'express';
import postController from '../controller/postController';
import upload from '../utils/imageHandler';

import { getUserToken } from '../middlewares/jwtAuth';
import uploader from '../middlewares/uploader';

const postRouter = Router();
postRouter.post(
  '/',
  getUserToken,
  uploader.single('postImage'),
  postController.createPost,
); // 글 생성
postRouter.get('/', postController.confirmAllPost); // 전체 게시글 조회
postRouter.get('/:_id', getUserToken, postController.confirmPost); // 글 하나 조회
postRouter.put('/:_id', getUserToken, postController.updatePost); // 수정
postRouter.put('/:_id/d', getUserToken, postController.deletePost); // 삭제
postRouter.put('/:_id/like', getUserToken, postController.likeHandle); // 좋아요

// 포스트 사진 등록
postRouter.post(
  '/:_id/postImage',
  getUserToken,
  upload.single('postImage'),
  postController.putPostImage,
);
// 포스트 사진 삭제
postRouter.delete(
  '/:_id/postImage',
  getUserToken,
  upload.single('postImage'),
  postController.deletePostImage,
);

export default postRouter;
