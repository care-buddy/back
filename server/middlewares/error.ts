import { Request, Response, NextFunction } from 'express';

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('전체 에러 핸들러:', err);
  res.status(500).json({ success: false, message: '서버 에러가 발생했습니다.', err: err.message });
}

export default errorHandler;