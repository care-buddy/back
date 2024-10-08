import postService from '../services/postServices';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

class PostController {
  // 글 생성
  async createPost(req: Request, res: Response) {
    try {
      const userId = req.user?._id; // 인증된 사용자 정보 활용
      const datas = req.body;

      const post = await postService.createPost({ userId, ...datas });
      res.status(201).json({ success: true, data: post._id });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 전체 게시글 조회
  async confirmAllPost(req: Request, res: Response) {
    try {
      const posts = await postService.confirmAllPosts();
      res.status(200).json({ success: true, data: posts });
    } catch (err: any) {
      res
        .status(500)
        .json({
          success: false,
          message: '게시글 조회 중 오류 발생',
          error: err.message,
        });
    }
  }

  // 커뮤니티별 게시글 조회
  async confirmCommunityPost(req: Request, res: Response) {
    try {
      const { _id } = req.params; // 커뮤니티 ID 받기
      const objectId = new mongoose.Types.ObjectId(_id); // ObjectId로 변환

      // 커뮤니티 ID에 해당하는 게시글 조회
      const posts = await postService.confirmCommunityPosts(objectId);

      // 게시글이 없으면 404 에러 반환
      // if (!posts.length) {
      //   return res
      //     .status(404)
      //     .json({ success: false, message: '게시글이 없습니다.' });
      // }

      // 게시글 반환
      res.status(200).json({ success: true, data: posts });
    } catch (err: any) {
      res
        .status(500)
        .json({
          success: false,
          message: '서버 오류가 발생했습니다.',
          error: err.message,
        });
    }
  }

  // 글 하나 조회
  async confirmPost(req: Request, res: Response) {
    try {
      const { _id } = req.params;
      const objectId = new mongoose.Types.ObjectId(_id);

      const post = await postService.confirmUserPosts(objectId);
      res.status(200).json({ success: true, data: post });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 글 수정
  async updatePost(req: Request, res: Response) {
    try {
      const { _id } = req.params;
      const postData = req.body;
      const objectId = new mongoose.Types.ObjectId(_id);

      const updatePost = await postService.updatePost(objectId, postData);
      res
        .status(200)
        .json({
          success: true,
          message: '성공적으로 수정이 완료되었습니다',
          data: updatePost,
        });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 글 삭제
  async deletePost(req: Request, res: Response) {
    try {
      const { _id } = req.params;
      const objectId = new mongoose.Types.ObjectId(_id);

      const deletePost = await postService.deletePost(objectId);
      res.status(200).json({
        success: true,
        message: '글 삭제가 완료되었습니다',
        data: deletePost,
      });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 좋아요 - 미들웨어 적용 필요
  async likeHandle(req: Request, res: Response) {
    try {
      const { _id } = req.params;
      const { userId } = req.body;
      const objectId = new mongoose.Types.ObjectId(_id);

      const like = await postService.likeChange(objectId, userId);
      res.status(200).json({ success: true, data: like });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 프로필 사진 등록
  async putPostImage(req: Request, res: Response) {
    try {
      const { _id } = req.params;
      const postImage = req.file?.filename;
      const objectId = new mongoose.Types.ObjectId(_id);

      const result = await postService.updatePostImage(objectId, postImage);
      res
        .status(200)
        .json({ message: '이미지가 수정되었습니다.', data: result });
    } catch (err: any) {
      res
        .status(500)
        .json({
          message: '서버의 postController에서 에러가 났습니다.',
          error: err.message,
        });
    }
  }

  // 프로필 사진 삭제 - 미들웨어 적용 필요
  async deletePostImage(req: Request, res: Response) {
    try {
      const { _id } = req.params;
      const postImage = 'public/image/defaultImage.png';
      const objectId = new mongoose.Types.ObjectId(_id);

      const result = await postService.updatePostImage(objectId, postImage);
      res
        .status(200)
        .json({ message: '이미지가 삭제되었습니다.', data: result });
    } catch (err: any) {
      res
        .status(500)
        .json({
          message: '서버의 postController에서 에러가 났습니다.',
          error: err.message,
        });
    }
  }
}

const postController = new PostController();
export default postController;

// import postService from '../services/postServices';
// import { Request, Response } from 'express';
// import mongoose from 'mongoose';

// class PostController {
//   // 글 생성
//   async createPost(req: Request, res: Response) {
//     try {
//       const userId = req.user?._id; // 인증된 사용자 정보 활용
//       const datas = req.body;

//       const post = await postService.createPost({ userId, ...datas });
//       res.status(201).json({ success: true, data: post });
//     } catch (err: any) {
//       res.status(500).json({ err: err.message });
//     }
//   }

//   // 전체 게시글 조회
//   async confirmAllPost(req: Request, res: Response) {
//     try {
//       const posts = await postService.confirmAllPosts();

//       res.status(200).json({ success: true, message: posts });
//     } catch (error) {
//       res
//         .status(500)
//         .json({ success: false, message: '게시글 조회 중 오류 발생', error });
//     }
//   }
//   // 글 하나 조회 - 미들웨어 적용 필요
//   async confirmPost(req: Request, res: Response) {
//     const { _id } = req.params;
//     const objectId = new mongoose.Types.ObjectId(_id);
//     const post = await postService.confirmUserPosts(objectId);
//     res.status(200).json({ success: true, message: post });
//   }

//   // 글 수정
//   async updatePost(req: Request, res: Response) {
//     const { _id } = req.params;
//     const postData = req.body;
//     const objectId = new mongoose.Types.ObjectId(_id);
//     const updatePost = await postService.updatePost(objectId, postData);
//     res
//       .status(200)
//       .json({ success: true, message: '성공적으로 수정이 완료되었습니다' });
//   }

//   // 글 삭제 - 미들웨어 적용 필요
//   async deletePost(req: Request, res: Response) {
//     const { _id } = req.params;
//     const objectId = new mongoose.Types.ObjectId(_id);

//     const deletePost = await postService.deletePost(objectId);
//     res.status(200).json({
//       success: true,
//       message: '글 삭제가 완료되었습니다',
//       data: deletePost,
//     });
//   }

//   // 좋아요 - 미들웨어 적용 필요
//   async likeHandle(req: Request, res: Response) {
//     const { _id } = req.params;
//     const { userId } = req.body;
//     const objectId = new mongoose.Types.ObjectId(_id);
//     const like = await postService.likeChange(objectId, userId);
//     res.status(200).json({ success: true, message: like });
//   }

//   // 프로필 사진 등록
//   async putPostImage(req: Request, res: Response) {
//     try {
//       const { _id } = req.params;
//       const postImage = req.file?.filename;
//       const objectId = new mongoose.Types.ObjectId(_id);
//       const result = await postService.updatePostImage(objectId, postImage);
//       console.log(result);
//       res
//         .status(200)
//         .json({ message: '이미지가 수정되었습니다.', data: result });
//     } catch (err: any) {

//       console.log(err);
//       res
//         .status(500)
//         .json({ message: '서버의 postContrller에서 에러가 났습니다.' });
//     }
//   }

//   // 프로필 사진 삭제 - 미들웨어 적용 필요(지금 x)
//   async deletePostImage(req: Request, res: Response) {
//     try {
//       const { _id } = req.params;
//       const postImage = `public/image/defaultImage.png`;
//       const objectId = new mongoose.Types.ObjectId(_id);
//       const result = await postService.updatePostImage(objectId, postImage);
//       res
//         .status(200)
//         .json({ message: '이미지가 삭제되었습니다.', data: result });
//     } catch (error) {
//       console.log(error);
//       res
//         .status(500)
//         .json({ message: '서버의 postContrller에서 에러가 났습니다.' });
//     }
//   }
// }
// const postController = new PostController();
// export default postController;
