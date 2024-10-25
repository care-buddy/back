import { Router } from 'express';
import authController from '../controller/authController';
import { refreshToken } from '../middlewares/jwtAuth';

const authRouter = Router();

authRouter.post('/signup', authController.signUp); // 회원가입
authRouter.post('/login', authController.signIn); // 로그인
authRouter.delete('/logout', authController.logOut); // 로그아웃
authRouter.post('/validate-email', authController.validateEmailExistence); // 이메일 중복 체크
authRouter.post('/send-email', authController.validateWithEmail); // 이메일 인증번호 발송
authRouter.post('/validate-authCode', authController.validateAuthCode); // 이메일 인증번호 확인
authRouter.get('/token', refreshToken, authController.createAccessToken); // 토큰 발급
authRouter.post('/silent-refresh', authController.silentRefresh); // 자동 로그인 연장

authRouter.post('/finding-id', authController.findingId) // 아이디 찾기
// authRouter.post('/send-password-reset-page', authController.sendPasswordResetLink ) // 비밀번호 재설정 링크 발송

export default authRouter;
