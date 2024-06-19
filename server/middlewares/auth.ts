import { decodePayload } from '../utils/jwt';
import { alertmove } from '../utils/alertmove';
import { Request, Response, NextFunction } from 'express';
import { userInfo } from 'os';

interface AuthenticatedRequest extends Request {
  user?: unknown;
}
export const mainAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const accessToken: string | undefined = req.cookies.accessToken; // 쿠키에서 accessToken을 가져옵니다.
  if (accessToken !== undefined) {
    try {
      const user = decodePayload(accessToken); // 토큰을 디코딩하여 사용자 정보를 추출합니다.
      req.user = user;
      
    } catch (error) {
      // 토큰이 유효하지 않은 경우, 여기에 예외 처리 코드를 추가할 수 있습니다.
      console.error('토큰 유효성 검사 오류:', error);
    }
  }
  next();
};

export const checkAuth = ( req: AuthenticatedRequest, res: Response, next: NextFunction,) => {
  const { accessToken } = req.cookies;
  if (accessToken !== undefined) {
    const user = decodePayload(accessToken);
    req.user = user;
    next();
  } else {
    return res.status(401).json({ message: '인증되지 않은 요청입니다.' });
  }
};
interface JwtPayload {
  email: string;
  iat: number;
  exp: number;
}

export const unAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { accessToken } = req.cookies;
  if (accessToken !== undefined) {
    const user = decodePayload(accessToken);
    req.user = user;
    next(); 
  }
};
