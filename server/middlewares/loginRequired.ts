// 토큰 검증 미들웨어
import { Request, Response, NextFunction } from 'express';
import passport from '../passport/index';
import userService from "../services/userServices"
import { checkUser, User } from '../db/schemas/user';
import jwt from 'jsonwebtoken';

// 토큰 검증
export const loginRequired = (req: Request, res: Response, next: NextFunction) => {
  console.log('req.headers:', req.headers);
  // request 헤더로부터 authorization bearer 토큰을 받음.
  const userToken = req.headers['authorization']?.split(' ')[1];
  console.log('req.userToken:', userToken);
/* 
  // 이 토큰은 jwt 토큰 문자열이거나, 혹은 "null" 문자열이거나, undefined임.
  // 토큰이 "null" 일 경우, login_required 가 필요한 서비스 사용을 제한함.
  if (!userToken || userToken === 'null') {
      res.status(401).json({
          result: 'forbidden-approach',
          reason: '로그인한 유저만 사용할 수 있는 서비스입니다.',
      });

      return;
  } */
};