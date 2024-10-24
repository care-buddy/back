import mongoose from 'mongoose';
import { User, checkUser } from '../schemas/user';

export class UserModel {
  static findByUserId(_id: mongoose.Types.ObjectId | undefined) {
    throw new Error('Method not implemented.');
  }
  // 유저 정보 등록 (로그인 시 최초 저장)
  async join(userData: {
    nickName: string;
    email: string;
    password: string;
    mobileNumber: string;
  }) {
    const user = await User.create(userData);
    return user;
  }

  // userId로 사용자 조회
  async findByUserId(_id: mongoose.Types.ObjectId) {
    // 유저 정보 조회의 _id 타입을 schema types object id로 맞춰야 할까
    const user = await User.findById({ _id })
      .populate('buddyId')
      .populate('postId')
      .populate('communityId')
      .populate('commentId');

    return user;
  }

  // 유저 이메일로 사용자 조회
  async findByEmail(email: string) {
    const user = await User.findOne({ email });
    // .populate('email');
    return user;
  }

  // 유저 이메일로 사용자 조회(로그인을 위해서 refreshToken반환)
  async findByEmailForLogin(email: string) {
    const user = await User.findOne({ email }).select('+refreshToken');
    return user;
  }

  // 유저 이메일로 사용자 조회 후 비밀번호 검증
  async findByEmailForPW(email: string) {
    const userPassword = await User.findOne({ email }, 'password');
    return userPassword;
  }

  // 유저 폰 번호로 이메일 조회
  async findEmailByMobileNumber(mobileNumber: string) {
    const user = await User.findOne({ mobileNumber }, 'email');
    if (!user) {
      return null;
    }
    return user.email;
  }

  async userForToken(email: string) {
    const user = await User.findOne(
      { email },
      {
        nickName: 1,
        name: 1,
        email: 1,
        profileImage: 1,
        isAdmin: 1,
        isTempPassword: 1,
      },
    );
    console.log(`UserModel_userForToken_user: ${user}`);
    return user;
  }

  async userRefreshToken(email: string) {
    const user = await User.findOne({ email }, 'refreshToken');
    return user;
  }

  // 유저 정보 수정
  async update(_id: mongoose.Types.ObjectId, userdata: checkUser) {
    const user = await User.findOneAndUpdate({ _id }, userdata, { new: true })
      .populate('buddyId')
      .populate('postId')
      .populate('communityId')
      .populate('commentId');
    return user;
  }

  // 회원 정보 삭제
  async deleteUser(_id: mongoose.Types.ObjectId) {
    const deletedUser = await User.findOneAndUpdate(
      { _id },
      { deletedAt: new Date() },
      { new: true },
    )
      .populate('buddyId')
      .populate('postId')
      .populate('communityId')
      .populate('commentId');
    console.log(_id);
    return deletedUser;
  }

  // 이메일과 휴대폰 번호로 사용자 조회
  async findUserByEmailAndMobile(email: string, mobileNumber: string) {
    const user = await User.findOne({ email, mobileNumber });
    return user;
  }

  // 프로필 사진 등록
  async updateProfileImage(email: string, profileImage?: string) {
    const result = await User.findOneAndUpdate(
      { email },
      { profileImage },
      { new: true },
    );
    return result;
  }
}
const userModel = new UserModel();
export default userModel;
