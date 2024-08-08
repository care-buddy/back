// 토큰 검증 미들웨어
import { Request, Response, NextFunction } from 'express';
import passport from '../passport/index';
import userService from "../services/userServices"
import { checkUser, User } from '../db/schemas/user';
import jwt from 'jsonwebtoken';

// 토큰 검증
export const getUserToken = (req: Request, res: Response, next: NextFunction) => {
  console.log('req.headers:', req.headers);
  //console.log('Authorization Header:', req.headers.authorization);

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