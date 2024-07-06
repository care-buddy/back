import jwt from 'jsonwebtoken';
import { User, checkUser } from '../db/schemas/user';
import userModel, { UserModel } from '../db/models/userModel';
import { Request, Response, NextFunction } from 'express';

require('dotenv').config();

const resfreshSecretKey: string | Buffer = process.env.REFRESH_SECRET || "";
const accessSecret: string | Buffer = process.env.ACCESS_SECRET || "";
const authCodeKey: string | Buffer = process.env.AUTH_CODE_KEY || "";
const algorithm: any = process.env.JWT_ALG
const expiresIn: string | undefined = process.env.JWT_EXP;

const option = { algorithm, expiresIn }

export const setUserToken = (user: any, isOnlyAccess: Number) => {
  const accessPayload = {
    nickName: user.nickName,
    email: user.email,
    profileImage: user.profileImage,
    isAdmin: user.adminNumber,
    isTempPassword: user.isTempPassword,
  };

  const accessToken = jwt.sign(accessPayload, accessSecret, option);

  if (!isOnlyAccess) {
    const refreshPayload = { email: user.email };
    const refreshOptions = { algorithm, expiresIn: '7d' };
    const refreshToken = jwt.sign(refreshPayload, resfreshSecretKey, refreshOptions);
    
    User.updateOne({ email: refreshPayload.email }, { refreshToken: refreshToken }) 
      .then((res) => {
        console.log('res : ', res);
      })
      .catch((err) => {
        console.log('fail : ', err);
      });

    return { accessToken, refreshToken };
  } else {
    return { accessToken };
  }
}

export const setAuthCodeToken = (authCode: String) => {
	const payload = { authCode: authCode };
	const options = { algorithm, expiresIn: "3m" }; // 토큰 만료시간 (3분)
	return jwt.sign(payload, authCodeKey, options);
};