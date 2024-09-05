// 토큰 검증 미들웨어
import { Request, Response, NextFunction } from 'express';
import passport from '../passport/index';
import userService from "../services/userServices"
import { checkUser, User } from '../db/schemas/user';
import jwt from 'jsonwebtoken';
import REFRESH_TOKEN_ROTATION_PERIOD from '../constants/authContants';
import { setAuthCodeToken, setUserToken } from '../utils/jwt';

require('dotenv').config();

// 토큰 검증
export const getUserToken = async (req: Request, res: Response, next: NextFunction) => {
  console.log("*** middleware/jwtAuth ***");
  console.log('req.cookies:', req.cookies);

  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: 'refreshToken이 없습니다.' });
  }

  // jwt.verify 함수에서 token 검증할 때 사용하는 secret키가 undefined가 아님을 확인(환경변수 체크)
const refreshSecret: string | Buffer = process.env.REFRESH_SECRET || '';
console.log('REFRESH_SECRET:', refreshSecret); // 비밀키 로그 추가
  if (!refreshSecret) {
    throw new Error('REFRESH_SECRET is not defined');
  }

  try {
    // token 검증
    const decoded: any = jwt.verify(refreshToken, refreshSecret);
    console.log('decoded refreshToken:', decoded); // 디코딩된 토큰 로그 추가

    // 유저 정보 가져오기
    const user = await userService.getUserFromEmailForLogin(decoded.email);

    if (!user) {
      console.log('인증 실패: 유효하지 않은 토큰');
      return res.status(401).json({ success: false, message: '인증 실패: 유효하지 않은 토큰' });
    }

    console.log('토큰 검증 성공:', user);

    // 요청 객체에 user를 추가하여 이후 미들웨어/컨트롤러에서 사용 가능하게 함
    req.user = user;

    next();
  } catch (err) {
    console.error('access authenticate 에러:', err);
    return res.status(500).json({ success: false, message: `토큰 검증 미들웨어 에러` });
  }
  /* 
    passport.authenticate('access', { session: false }, async (err: Error, user: checkUser) => {
      if (err) {
        console.error('access authenticate 에러:', err);
        return res.status(500).json({ success: false, message: `토큰 검증 미들웨어 에러: ${err.message}` });
      }
  
      if (!user) {
        console.log('인증 실패: 유효하지 않은 토큰');
        return res.status(401).json({ success: false, message: '인증 실패: 유효하지 않은 토큰' });
      }
  
      console.log('토큰 검증 성공:', user);
  
      // 요청 객체에 user를 추가하여 이후 미들웨어/컨트롤러에서 사용 가능하게 함
      req.user = user;
  
      next();
    })(req, res, next); // 반환된 함수 호출
   */
}

// 토큰 리프레시
export const refreshToken = (req: Request, res: Response, next: NextFunction) => {
  console.log('req.headers:', req.headers);
  passport.authenticate('refresh', { session: false }, async (err: Error, user: checkUser) => {
    if (err) {
      console.log('refresh authenticate 에러:', err);
      return res.status(500).send({ message: `토큰 검증 미들웨어 에러: ${err.message}` });
    }

    if (!user) {
      return res.status(401).send({ message: '인증되지 않은 사용자입니다.' });
    }

    const { email } = user;
    try {
      const userRefreshToken = await userService.getUserRefreshToken(email);
      const inputRefreshToken = req.headers.authorization?.substring(7);

      if (userRefreshToken?.refreshToken === inputRefreshToken) {
        console.log('refresh Authorized');
        next();
      } else {
        res.status(403).send({ message: 'refresh 토큰이 만료되었거나 유효하지 않습니다.' });
      }
    } catch (error) {
      console.log('refresh token 조회 에러:', error);
      res.status(500).send({ message: '서버 오류 발생' });
    }
  })(req, res, next);
};