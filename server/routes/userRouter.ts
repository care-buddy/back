import { Router } from 'express';
import userController from '../controller/userController';
import upload from '../utils/imageHandler';
import { unAuth } from '../middlewares/auth';

const userRouter = Router();

userRouter.get('/', userController.getMyPage);  // 회원 정보 조회
//userRouter.get('/:_id', userController.confirmUser);
//userRouter.put('/:_id', userController.updateUser); // 수정
//userRouter.put('/:_id/w', userController.deleteUser); // 삭제
//userRouter.put('/:_id/joinGroup', userController.joinCategory); // 그룹 가입
//userRouter.put('/:_id/withdrawGroup', userController.withdrawalCategory); // 그룹 탈퇴
// userRouter.get('/me', unAuth, userController.confirmUserMe); //

// 프로필 사진 등록
userRouter.post('/:email/profileImage', upload.single('profileImage'), userController.putProfileImage);
// 프로필 사진 삭제
userRouter.delete('/:email/profileImage', upload.single('profileImage'), userController.deleteProfileImage);

export default userRouter;
