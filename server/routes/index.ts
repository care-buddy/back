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

import { getUserToken } from '../middlewares/jwtAuth';

const router = Router();
//router.use('/api/auth', kakaoRouter);
router.use('/api/auth', authRouter);
router.use('/api/users', userRouter); 
router.use('/api/communities', communityRouter); 
router.use('/api/buddies', getUserToken, buddyRouter);
router.use('/api/posts', postRouter);
router.use('/api/hospitals', getUserToken, hospitalRouter);
router.use('/api/comments', commentRouter);
router.use('/api/searches', searchRouter);
//router.use('/api/me', unAuth, userController.confirmUserMe); //추가

export default router;
