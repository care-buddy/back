require('dotenv').config();
import jwt from 'jsonwebtoken';

const secretKey: string | undefined = process.env.SECRET_KEY;
const algorithm: any = process.env.JWT_ALG
const expiresIn: string | undefined = process.env.JWT_EXP;

const option = { algorithm, expiresIn }

function makeToken(payload: string | object) {
  if (!secretKey) return { status: 404, err: '비밀키가 정의되지 않았습니다.' }
  return jwt.sign(payload, secretKey, option);
}

function decodePayload(token: string) {
  if (!secretKey) return { status: 404, err: '비밀키가 정의되지 않았습니다.' }
  return jwt.verify(token, secretKey);
}

export { makeToken, decodePayload };
