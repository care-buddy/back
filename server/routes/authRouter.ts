import { Router } from 'express';
import authController from '../controller/authController';
import { refreshToken } from '../middlewares/jwtAuth';

const authRouter = Router();

authRouter.post('/signup', authController.signUp);                      // 회원가입
authRouter.post('/login', authController.signIn);                       // 로그인
authRouter.post('/logout', authController.logOut);                      // 로그아웃
authRouter.post('/sendemail', authController.validateWithEmail);        // 이메일 인증번호 발송
authRouter.get('/token', refreshToken, authController.createAccessToken)              // 토큰 발급

export default authRouter;