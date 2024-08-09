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
router.use('/api/auth', authRouter)
router.use('/api/user', userRouter);
router.use('/api/communities', communityRouter);
router.use('/api/buddy', buddyRouter);
router.use('/api/post', postRouter);
router.use('/api/hospital', hospitalRouter);
router.use('/api/comment', commentRouter);
router.use('/api/search', searchRouter);
//router.use('/api/me', unAuth, userController.confirmUserMe); //추가

export default router;
