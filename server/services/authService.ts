import userModel, { UserModel } from '../db/models/userModel';
import { checkUser } from '../db/schemas/user';
import categoryModel, { CategoryModel } from '../db/models/categoryModel';
import { verifyPassword } from '../utils/hash';

class AuthService {
  userModel: UserModel;
  categoryModel: CategoryModel;

  constructor(userModel: UserModel, categoryModel: CategoryModel) {
    this.userModel = userModel;
    this.categoryModel = categoryModel;
  }

  // 회원가입
  async createUser(userData: { nickName: string; email: string; password: string }) {
    const { email } = userData;
    const foundUser = await userModel.findByEmail(email);
    if (foundUser && foundUser.email == email) return { status: 400, err: '중복된 이메일입니다.' }

    const newUser = await userModel.join(userData);

    return newUser;
  }

  // 유저 이메일 조회
  async getUserFromEmail(email: string) {
    const user = await userModel.findByEmail(email);
    return user;
  }

  // 유저 이메일로 사용자 조회 후 비밀번호 검증
  async emailForPW(email: string) {
    const userPassword = await userModel.findByEmailForPW(email);
    return userPassword;
  }

  // 사용자 검증
  async validateUser(email: string, password: string) {
    const findUser = await userModel.findByEmail(email);
    if (!findUser) {
      return null;
    }

    const isMatch = await verifyPassword(password, findUser.password);
    if (!isMatch) {
      return null;
    }

    return findUser;
  }

  // token 사용
  async getUserForToken(email: string) {
    const user = await userModel.userForToken(email);
    return user;
  }

  // refreshToken 사용
  async getUserRefreshToken(email: string) {
    const user = await userModel.userRefreshToken(email);
    return user;
  }

  // refreshToken 무효화
  async invalidateRefreshToken(email: string) {
    const user = await userModel.findByEmail(email);
    
    if (user) {
      user.refreshToken = null; // 또는 유효하지 않은 값으로 설정
      await user.save();
    }
  }
}

const authService = new AuthService(userModel, categoryModel);
export default authService;
