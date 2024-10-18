import { Router } from 'express';
import meController from '../controller/meController'; // meController를 import합니다.
import { getUserToken } from '../middlewares/jwtAuth'; // JWT 인증 미들웨어 import
import uploader from '../middlewares/uploader';

const meRouter = Router();

// 현재 로그인한 사용자 정보 조회
meRouter.get('/', getUserToken, meController.getMe); // meController의 getMe 메서드 사용

// 현재 로그인한 사용자 정보 업데이트
meRouter.put(
  '/',
  getUserToken,
  uploader.single('profileImage'),
  meController.updateMe,
); // 추가된 메서드

// 현재 로그인한 사용자 계정 삭제
meRouter.delete('/', getUserToken, meController.deleteMe); // 추가된 메서드

// 프로필 사진 등록
meRouter.post('/profileImage', getUserToken, meController.putProfileImage); // 추가된 메서드

// 프로필 사진 삭제
meRouter.delete('/profileImage', getUserToken, meController.deleteProfileImage); // 추가된 메서드

export default meRouter;
