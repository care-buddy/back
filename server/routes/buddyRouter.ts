import { Router } from 'express';
import buddyController from '../controller/buddyController';
import upload from '../utils/imageHandler';
// upload 라는 이미지 업로드 로직이 있는 것 같은데, 수정하고 활용하는게 더 어려워 새로 생성
import uploader from '../middlewares/uploader';
const buddyRouter = Router();

// 삭제는 put 으로

/* 클라에서 파일(이미지) 업로드 시, 서버로 multipart/form-data 형식으로 전송
  이를 multer를 사용하여 처리
  'buddyImage' 이름의 파일 하나만 처리하여(single()), 그걸 req.file 객체에 저장합니다 */
buddyRouter.post(
  '/',
  uploader.single('buddyImage'),
  buddyController.createBuddy,
); // 반려동물 등록
buddyRouter.get('/', buddyController.getAllBuddy); // 회원의 모든 반려동물 조회
buddyRouter.get('/:_id', buddyController.getBuddyById); // 회원의 반려동물 1마리 조회
buddyRouter.put(
  '/:_id',
  uploader.single('buddyImage'),
  buddyController.updateBuddy,
); // 반려동물 정보 수정
buddyRouter.put('/:_id/d', buddyController.deleteBuddy); // 반려동물 삭제

// 프로필 사진 등록
buddyRouter.post(
  '/:_id/buddyImage',
  upload.single('buddyImage'),
  buddyController.putBuddyImage,
);
// 프로필 사진 삭제
buddyRouter.delete(
  '/:_id/buddyImage',
  upload.single('buddyImage'),
  buddyController.deleteBuddyImage,
);

export default buddyRouter;
