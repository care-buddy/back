import { Request, Response, NextFunction } from 'express';

function loginRequired(err: Error, req: Request, res: Response, next: NextFunction) {
  // 로그인 x -> 메인화면
  if (!req.user) {
    res.redirect('/');
    return;
  }
  // 로그인 o -> 다음 미들웨어
  next();
}

export default loginRequired;