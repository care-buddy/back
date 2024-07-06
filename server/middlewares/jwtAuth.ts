// 토큰 검증 미들웨어
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import authService from "../services/authService"
import { checkUser, User } from '../db/schemas/user';


// 토큰 검증
export const getUserToken = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('access', { session: false }, async (err: Error, user: checkUser) => {
		if (err) {
			console.log('access authenticate 에러');
			res.status(500).send({ message: `토큰 검증 미들웨어 에러: ${err.message}` });
		} else {
			next();
		}
	});
}

// 토큰 리프레시
export const refreshToken = (req: Request, res: Response, next: NextFunction) => {
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
      const userRefreshToken = await authService.getUserRefreshToken(email);
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