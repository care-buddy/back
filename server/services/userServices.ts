import mongoose from 'mongoose';
import userModel, { UserModel } from '../db/models/userModel';
import { checkUser } from '../db/schemas/user';
import communityModel, { CommunityModel } from '../db/models/communityModel';
import { verifyPassword } from '../utils/hash';

class UserService {
  userModel: UserModel;
  communityModel: CommunityModel;
  constructor(userModel: UserModel, communityModel: CommunityModel) {
    this.userModel = userModel;
    this.communityModel = communityModel;
  }

  // 회원가입
  async createUser(userData: {
    nickName: string;
    email: string;
    password: string;
    mobileNumber: string;
  }) {
    const { email } = userData;
    const foundUser = await userModel.findByEmail(email);
    if (foundUser && foundUser.email == email)
      return { status: 400, err: '중복된 이메일입니다.' };

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
    // 이메일로 사용자 찾기
    const user = await userModel.findByEmail(email);
    return user;
  }

  async getUserFromEmailForLogin(email: string) {
    // 이메일로 사용자 찾기(로그인용 - refreshToken 반환)
    const user = await userModel.findByEmailForLogin(email);
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
    if (!_id) return { status: 404, err: '작업에 필요한 ID가 없습니다.' };
    const updateUser = await this.userModel.update(_id, userdata);
    if (!updateUser)
      return { status: 404, err: '작업에 필요한 유저가 없습니다.' };
    return updateUser;
  }

  // 회원 정보 삭제
  async deleteUser(_id: mongoose.Types.ObjectId) {
    const foundUser = await this.userModel.deleteUser(_id);
    if (!foundUser) return { status: 404, err: '해당 유저가 없습니다.' };

    return foundUser;
  }

  // 그룹 가입
  async joinCommunity(
    _id: mongoose.Types.ObjectId,
    communityId: mongoose.Types.ObjectId,
  ) {
    const user = await this.userModel.findByUserId(_id);
    const community = await this.communityModel.findByCommunityId(communityId);

    if (!user) return { status: 404, err: '작업에 필요한 유저가 없습니다.' };
    else if (!community)
      return { status: 404, err: '작업에 필요한 카테고리가 없습니다.' };

    // 사용자가 이미 그룹에 속해있을 때
    if (user.communityId.some((cat) => cat?._id?.equals(community._id)))
      return { status: 400, err: '사용자가 이미 그룹에 속해 있습니다.' };

    user.communityId.push(community._id);
    await user.save();

    return user;
  }

  // 그룹 탈퇴
  async withdrawalCommunity(
    _id: mongoose.Types.ObjectId,
    communityId: mongoose.Types.ObjectId,
  ) {
    const user = await this.userModel.findByUserId(_id);
    const community = await this.communityModel.findByCommunityId(communityId);
    if (!user) return { status: 404, err: '작업에 필요한 유저가 없습니다.' };
    else if (!community)
      return { status: 404, err: '작업에 필요한 카테고리가 없습니다.' };

    // 사용자가 그룹에 속해 있는지 확인
    const index = user.communityId.findIndex((cat) =>
      cat?._id?.equals(community._id),
    );

    if (index === -1)
      return { status: 400, err: '사용자가 그룹에 속해 있지 않습니다.' };

    // 그룹에서 사용자를 제거
    user.communityId.splice(index, 1);
    await user.save();

    return user;
  }

  // 폰번호로 이메일 조회
  async getEmailFromMobileNumber(mobileNumber: string) {
    const email = await this.userModel.findEmailByMobileNumber(mobileNumber);

    if (typeof email === 'string') {
      // 이메일의 골뱅이 앞 부분에서 마지막 두 자리를 **로 마스킹 처리
      const [emailFront, emailBack] = email.split('@');
      const hidedEmailFront =
        emailFront.length > 2 ? `${emailFront.slice(0, -2)}**` : '**';
      const hidedEmail = `${hidedEmailFront}@${emailBack}`;

      return { status: 200, email: hidedEmail };
    }

    return {
      status: 404,
      err: '해당하는 휴대폰 번호로 등록된 이메일이 없습니다.',
    };
  }

  // 폰번호와 이메일로 사용자 조회
  async getUserByEmailAndMobile(email: string, mobileNumber: string) {
    const user = await this.userModel.findUserByEmailAndMobile(
      email,
      mobileNumber,
    );
    if (!user) {
      return { status: 404, err: '사용자를 찾을 수 없습니다.' };
    }
    return { status: 200, data: user };
  }
  // 프로필 사진 등록 및 삭제
  async updateProfileImage(email: string, profileImage?: string) {
    console.log(`${email}의 프로필을 수정합니다. [Service]`);
    const result = await this.userModel.updateProfileImage(email, profileImage);
    return result;
  }
}

const userService = new UserService(userModel, communityModel);
export default userService;
