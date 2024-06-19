import { Request, Response, NextFunction } from 'express';

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(500).json({ success: false, err });
}

export default errorHandler;