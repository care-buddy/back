import { Request, Response } from 'express';
import { hashPassword, verifyPassword } from '../utils/hash';
import { setAuthCodeToken, setUserToken } from '../utils/jwt';
import { generateRandomCode } from '../utils/generateRandomCode';
import sendMail from '../utils/sendMail';
import userService from '../services/userServices';
import jwt from 'jsonwebtoken';
import authCodeCache from '../utils/cache';
import REFRESH_TOKEN_ROTATION_PERIOD from '../constants/authContants';

class AuthController {
  // 회원가입
  async signUp(req: Request, res: Response) {
    const { nickName, email, password, mobileNumber } = req.body;

    // 입력 데이터 검증
    if (!nickName || !email || !password || !mobileNumber) {
      return res
        .status(400)
        .json({ success: false, message: '필수 입력 값입니다' });
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    const newUser = await userService.createUser({
      nickName,
      email,
      password: hashedPassword,
      mobileNumber,
    });

    res.status(201).json({ success: true, data: newUser });
  }

  // 로그인
  async signIn(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await userService.getUserFromEmailForLogin(email);

    if (user === null) {
      return res.status(400).json({ message: '계정이 존재하지 않습니다.' });
    }
    if (user.deletedAt !== null) {
      return res.status(400).json({ message: '탈퇴한 계정입니다.' });
    }

    const userPassword = await userService.emailForPW(email);

    if (userPassword === null) {
      return res
        .status(400)
        .json({ message: '비밀번호가 설정되지 않았습니다.' });
    }

    const isPasswordValid = await verifyPassword(
      password,
      userPassword.password,
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: '비밀번호가 틀렸습니다.' });
    }

    setUserToken(user, 0, res);
  }

  // silent-refresh: refreshToken을 이용한 자동 로그인 연장
  async silentRefresh(req: Request, res: Response) {
    try {
      // 쿠키에서 refreshToken 추출
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token이 없습니다.' });
      }

      // jwt.verify 함수에서 refreshToken을 검증할 때 사용하는 secret키가 undefined가 아님을 확인(환경변수 체크)
      const refreshSecret = process.env.REFRESH_SECRET;
      if (!refreshSecret) {
        throw new Error('REFRESH_SECRET is not defined');
      }

      // refreshToken 검증
      const decoded: any = jwt.verify(refreshToken, refreshSecret);

      // 유저 정보 가져오기
      const user = await userService.getUserFromEmailForLogin(decoded.email);
      if (!user) {
        return res.status(401).json({ message: '유효하지 않은 사용자입니다.' });
      }

      console.log(refreshToken, user.refreshToken);
      // 유저의 refreshToken이 DB에 저장된 것과 일치하는지 확인
      if (user.refreshToken !== refreshToken) {
        return res
          .status(401)
          .json({ message: '사용자의 refresh token이 유효하지 않습니다.' });
      }

      // 일정 기간이 지난 경우에만 새로운 refreshToken 발급
      const refreshTokenAge =
        Date.now() - new Date(decoded.iat * 1000).getTime();
      if (refreshTokenAge > REFRESH_TOKEN_ROTATION_PERIOD) {
        // 새로운 accessToken과 refreshToken 발급
        setUserToken(user, 0, res); // isOnlyAccess를 0으로 설정해 refreshToken도 새로 발급
      } else {
        // 기존 accessToken만 발급
        setUserToken(user, 1, res); // isOnlyAccess를 1로 설정해 기존 refreshToken 사용
      }
    } catch (error) {
      console.error('Silent refresh error:', error);
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
  }

  // 로그아웃
  async logOut(req: Request, res: Response) {
    // const email = req.user?.email;
    try {
      res.cookie('refreshToken', null, { maxAge: 0 });
      res.status(200).json({ message: '로그아웃 성공!!' });
    } catch (error) {
      res.status(500).json({ message: '로그아웃 중 오류 발생' });
    }
  }

  // 이메일 중복 검사
  async validateEmailExistence(req: Request, res: Response) {
    const { email } = req.body;
    const user = await userService.getUserFromEmail(email);
    if (user) {
      res
        .status(409)
        .json({ message: '해당 아이디로 가입된 사용자가 있습니다' });
    } else {
      res.status(201).json({
        message: '해당 아이디로 가입이 가능합니다',
      });
    }
  }

  // 이메일 인증번호 발송
  async validateWithEmail(req: Request, res: Response) {
    const { email } = req.body;

    // 인증번호 발송
    const authCode = generateRandomCode();

    // 만료시간 설정
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5분

    authCodeCache[email] = { code: authCode, expiresAt };

    await sendMail(
      email,
      `carebuddy 인증번호 발급 안내`,
      '이메일 인증번호',
      `${authCode}`,
      7,
    );
    res.send({
      message: '인증번호 전송 완료',
    });
  }

  // 이메일 인증번호 확인
  async validateAuthCode(req: Request, res: Response) {
    const { email, authCode } = req.body;

    const authData = authCodeCache[email];

    if (!authData) {
      return res.status(400).json({
        message: '인증번호가 존재하지 않습니다.',
      });
    }

    const { code, expiresAt } = authData;

    // 현재 시간이 만료 시간을 초과하는지 확인
    if (Date.now() > expiresAt) {
      delete authCodeCache[email]; // 만료된 인증번호 삭제
      return res.status(400).json({
        message: '인증번호가 만료되었습니다.',
      });
    }

    // 인증번호 일치 여부 확인
    if (code === authCode) {
      delete authCodeCache[email]; // 인증 완료 후 삭제
      res.status(200).json({
        message: '인증번호가 확인되었습니다.',
      });
    } else {
      res.status(400).json({
        message: '잘못된 인증번호입니다.',
      });
    }
  }

  // 아이디 찾기 
  async findingId(req: Request, res: Response) {
    const { mobileNumber } = req.body;
    const email = await userService.getEmailFromMobileNumber(mobileNumber);

    // 이메일 골뱅이 앞 두자리 **로 처리


    res
    .status(200)
    .json({message: '아이디 조회', email })

  }

  // 토큰 발급
  async createAccessToken(req: Request, res: Response) {
    const { email } = req.body;
    const userToken = await userService.getUserForToken(email);
    res
      .status(200)
      .json({ message: '토큰 발급', token: setUserToken(userToken, 1, res) });
  }
}

const authController = new AuthController();
export default authController;
