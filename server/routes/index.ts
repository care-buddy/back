import { Router } from 'express';
//import kakaoRouter from './kakaoRouter';
import authRouter from './authRouter';
import userRouter from './userRouter';
import communityRouter from './communityRouter';
import buddyRouter from './buddyRouter';
import postRouter from './postRouter';
import hospitalRouter from './hospitalRouter';
import commentRouter from './commentRouter';
import searchRouter from './searchRouter';

//import { unAuth } from '../middlewares/auth'; //추가
import userController from '../controller/userController'; //추가

const router = Router();
//router.use('/api/auth', kakaoRouter);
router.use('/api/auth', authRouter);
router.use('/api/users', userRouter); 
router.use('/api/communities', communityRouter); 
router.use('/api/buddies', buddyRouter);
router.use('/api/posts', postRouter);
router.use('/api/hospitals', hospitalRouter);
router.use('/api/comments', commentRouter);
router.use('/api/searchs', searchRouter);
//router.use('/api/me', unAuth, userController.confirmUserMe); //추가

export default router;
