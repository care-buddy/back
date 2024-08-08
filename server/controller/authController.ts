import { Request, Response } from 'express';
import { hashPassword, verifyPassword } from '../utils/hash';
import { setAuthCodeToken, setUserToken } from '../utils/jwt';
import { generateRandomCode } from '../utils/generateRandomCode';
import sendMail from '../utils/sendMail';
import userService from '../services/userServices';

class AuthController {
  // 회원가입
  async signUp(req: Request, res: Response) {
    const { nickName, email, password } = req.body;

    // 입력 데이터 검증
    if (!nickName || !email || !password) {
      return res.status(400).json({ success: false, message: '필수 입력 값입니다' });
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    const newUser = await userService.createUser({
      nickName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ success: true, data: newUser });
  }
  
  // 로그인
  async signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await userService.getUserFromEmail(email);

    if (user === null) {
      return res.status(400).json({ message: "계정이 존재하지 않습니다." });
    }
    if (user.deletedAt !== null) {
      return res.status(400).json({ message: "탈퇴한 계정입니다." });
    }

    const userPassword = await userService.emailForPW(email);
    
    if (userPassword === null) {
      return res.status(400).json({ message: "비밀번호가 설정되지 않았습니다." });
    }
    
    const isPasswordValid = await verifyPassword(password, userPassword.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: "비밀번호가 틀렸습니다." });
    }

    res.status(200).json({ success: true, message: '로그인 성공', token: setUserToken(user, 0) });
  }

  // 로그아웃
  async logOut(req: Request, res: Response) {
    const { email } = req.body;

    try {
      await userService.invalidateRefreshToken(email);
      res.status(200).json({ message: "로그아웃 성공!!" });
    } catch (error) {
      res.status(500).json({ message: "로그아웃 중 오류 발생" });
    }
  }

  // 이메일 인증번호 발송
  async validateWithEmail(req: Request, res: Response) {
    const { email } = req.body;
    const user = await userService.getUserFromEmail(email);

    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    else if (user.deletedAt !== null) {
      res.status(400).json({ message: "탈퇴한 계정입니다." });
    }
    else {
      // 인증번호 발송
      const authCode = generateRandomCode();
      await sendMail(email, `carebuddy 인증번호 발급 안내`, "이메일 인증번호", `${authCode}`, 7);
      res.send({ message: "인증번호 전송 완료", token: setAuthCodeToken(authCode) });
    }
  }

  // 토큰 발급
	async createAccessToken(req: Request, res: Response) {
		const { email } = req.body;
		const userToken = await userService.getUserForToken(email);
		res.status(200).json({ message: "토큰 발급", token: setUserToken(userToken, 1) });
	}
}

const authController = new AuthController();
export default authController;

