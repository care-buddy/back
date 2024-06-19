import { Request, Response, NextFunction } from 'express';
import { User } from '../db/schemas/user';
import ValidationError from '../utils/validationError';

export const bodyChecker = async (req: Request, res: Response, next:NextFunction) => {
  const { email } = req.body;
  const user = await User.findOne({ email })
  if (user)  return { status: 400, err: '중복된 아이디입니다.'
  }
  next()
}
