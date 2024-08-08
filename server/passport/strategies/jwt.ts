import { Request, Response, NextFunction } from 'express';
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { StrategyOptions } from 'passport-jwt';
import userModel, { UserModel } from '../../db/models/userModel';
import { User } from '../../db/schemas/user';
import dotenv from 'dotenv';

dotenv.config();

const secretKey: string | Buffer = process.env.SECRET_KEY || "";

interface JwtPayload {
  email: string;
}

const jwtOptions: StrategyOptions = {
  secretOrKey: secretKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

export const accessJwt = new JwtStrategy(jwtOptions, async (payload: JwtPayload, done: VerifiedCallback) => {
  try {
    // payload에서 email 추출 -> findByEmail에 전달
    const user = await userModel.findByEmail(payload.email);
    console.log(`** strategy accessJwt : [[ ${ user } ]]`);
    if (!user) {
      return done(null, false, { message: '유저를 찾을 수 없습니다.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

export const refreshJwt = new JwtStrategy(jwtOptions, async (payload: JwtPayload, done: VerifiedCallback) => {
  const user = await User.findOne(
    { email: payload.email },
    { refreshToken: 1, email: 1 }
  );

  if (!user) {
    return done(null, false, { message: '유저를 찾을 수 없습니다.' });
  }

  return done(null, user);
});
