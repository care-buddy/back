import mongoose from 'mongoose';
import userModel, { UserModel } from '../db/models/userModel';
import { checkUser } from '../db/schemas/user';
import categoryModel, { CategoryModel } from '../db/models/categoryModel';
import { verifyPassword } from '../utils/hash';

class UserService {
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

  // 회원 정보 조회 (마이페이지)
  async getMyPage(_id: mongoose.Types.ObjectId) {
    const user = await this.userModel.findByUserId(_id);

    console.log(user);

    return user;
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

  // 회원 정보 수정
  async updateUser(_id: mongoose.Types.ObjectId, userdata: checkUser) {
    if (!_id) return { status: 404, err: '작업에 필요한 ID가 없습니다.' }
    const updateUser = await this.userModel.update(_id, userdata);
    if (!updateUser) return { status: 404, err: '작업에 필요한 유저가 없습니다.' }
    return updateUser;
  }

  // 회원 정보 삭제
  async deleteUser(_id: mongoose.Types.ObjectId) {
    const foundUser = await this.userModel.deleteUser(_id);
    if (!foundUser) return { status: 404, err: '해당 유저가 없습니다.' }

    return foundUser;
  }

  // 그룹 가입
  async joinCategory(_id: mongoose.Types.ObjectId, categoryId: string) {
    const user = await this.userModel.findByUserId(_id);
    const category = await this.categoryModel.findByCategoryId(categoryId);

    if (!user) return { status: 404, err: '작업에 필요한 유저가 없습니다.' }
    else if (!category) return { status: 404, err: '작업에 필요한 카테고리가 없습니다.' }

    // 사용자가 이미 그룹에 속해있을 때
    if (user.categoryId.some((cat) => cat?._id?.equals(category._id))) return { status: 400, err: '사용자가 이미 그룹에 속해 있습니다.' }
    
    user.categoryId.push(category._id);
    await user.save();

    return user;
  }

  /*   async confirmAllUser() {
      const users = await this.userModel.findAllUsers();
      return users;
    }
  
    async withdrawalCategory(_id: string, categoryId: string) {
      const user = await this.userModel.findByUserId(_id);
      const category = await this.categoryModel.findByCategoryId(categoryId);
      if (!user) return { status: 404, err: '작업에 필요한 유저가 없습니다.' }
      else if (!category)return { status: 404, err: '작업에 필요한 카테고리가 없습니다.' }
  
      // 사용자가 그룹에 속해 있는지 확인
      const index = user.categoryId.findIndex((cat) => cat?._id?.equals(category._id));
  
  
      if (index === -1) return { status: 400, err: '사용자가 그룹에 속해 있지 않습니다.' }
  
      // 그룹에서 사용자를 제거
      user.categoryId.splice(index, 1);
      await user.save();
  
      return user;
    }
   */
  // 프로필 사진 등록 및 삭제
  async updateProfileImage(email: string, profileImage?: string) {
    console.log(`${email}의 프로필을 수정합니다. [Service]`);
    const result = await this.userModel.updateProfileImage(email, profileImage);
    return result;
  }
}

const userService = new UserService(userModel, categoryModel);
export default userService;
