import { Request, Response, Router } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { makeToken } from '../utils/jwt';
import { unAuth } from '../middlewares/auth';
import { User } from '../db/schemas/user';
require('dotenv').config();

interface AuthenticatedRequest extends Request {
  user?: { email: string }; // user 속성을 string 타입의 email 속성을 가진 객체로 정의
}
const kakaoRouter = Router();

interface KakaoOpt {
  clientId: string;
  redirectUri: string;
  clientSecret: string;
}

const kakaoOpt: KakaoOpt = {
  clientId: process.env.KAKAO_REST_API_KEY || '',
  redirectUri: process.env.REDIRECT_URI || '',
  clientSecret: process.env.SECRET_KEY || '',
};

kakaoRouter.get('/kakao/callback', async (req: Request, res: Response) => {
  let token;
  try {
    const url = 'https://kauth.kakao.com/oauth/token';
    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: kakaoOpt.clientId,
      client_secret: kakaoOpt.clientSecret,
      redirect_uri: kakaoOpt.redirectUri,
      code: req.query.code,
    });
    const header: AxiosRequestConfig['headers'] = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    const response = await axios.post(url, body, { headers: header });
    token = response.data.access_token;
  } catch (err) {
    console.log(err);
    console.log('에러1');
    res.send('에러1');
  }

  try {
    const url = 'https://kapi.kakao.com/v2/user/me';
    const Header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(url, Header);
    const { email } = response.data.kakao_account;

    const user = await User.findOne({ email });
    const accessToken = makeToken({ email });
    const cookiOpt = {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: false,
      secure: false,
    };
    res.cookie('accessToken', accessToken, cookiOpt);
    // if (user) { // 로그인 바로 _id: user._id, redirectUrl
    //   res.redirect("http://localhost:5173/userpage");
    // } else { // 회원가입
    //   res.redirect("http://localhost:5173")
    // }
    if (user) {
      // 로그인 바로 _id: user._id, redirectUrl
      res.redirect('http://kdt-sw-8-team01.elicecoding.com/');
    } else {
      // 회원가입
      res.redirect('http://kdt-sw-8-team01.elicecoding.com/signup-info');
    }
  } catch (err) {
    console.log(err);
  }
});

kakaoRouter.get(
  '/checking',
  unAuth,
  (req: AuthenticatedRequest, res: Response) => {
    const { user } = req;
    res.json(user);
  },
);
export default kakaoRouter;
