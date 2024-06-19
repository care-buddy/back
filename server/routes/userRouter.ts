import { Router } from 'express';
import userController from '../controller/userController';
import upload from '../utils/imageHandler';
import { unAuth } from '../middlewares/auth';

const userRouter = Router();

userRouter.get('/', userController.confirmAllUser);
userRouter.post('/', userController.joinUser);
userRouter.get('/:_id', userController.confirmUser);
userRouter.put('/:_id', userController.updateUser); // 수정
userRouter.put('/:_id/w', userController.deleteUser); // 삭제
userRouter.delete('/:_id/w', userController.deleteUserReal); // 실제로는 사용 안하는 진짜 삭제
userRouter.put('/:_id/joinGroup', userController.joinCategory); // 그룹 가입
userRouter.put('/:_id/withdrawGroup', userController.withdrawalCategory); // 그룹 탈퇴
// userRouter.get('/me', unAuth, userController.confirmUserMe); //

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
