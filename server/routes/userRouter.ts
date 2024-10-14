import { Router } from 'express';
import userController from '../controller/userController';
import { getUserToken } from '../middlewares/jwtAuth';
import upload from '../utils/imageHandler';
import { loginRequired } from '../middlewares/loginRequired';

const userRouter = Router();

// 삭제는 put 으로
// 회원 정보 조회
userRouter.get('/:_id', userController.getMyPage);
<<<<<<< HEAD

=======
>>>>>>> c5fac87fdd1cd885f399d4ac8324288030c0b740
// 회원 정보 수정
userRouter.put('/:_id', userController.updateUser);
// 회원 정보 삭제
userRouter.put('/:_id/d', userController.deleteUser);

// 그룹 가입
userRouter.put('/:_id/joinCommunity', userController.joinCommunity);
// 그룹 탈퇴
userRouter.put('/:_id/withdrawalCommunity', userController.withdrawalCommunity);

// 프로필 사진 등록
userRouter.post(
  '/:email/profileImage',
  upload.single('profileImage'),
  userController.putProfileImage,
);
// 프로필 사진 삭제
userRouter.delete(
  '/:email/profileImage',
  upload.single('profileImage'),
  userController.deleteProfileImage,
);

export default userRouter;
