import mongoose from "mongoose";
import { User, checkUser } from "../schemas/user";
export class UserModel {
  // 전체 유저 정보 조회
  async findAllUsers() {
    const users = await User.find({});
    return users;
  }

  async findByUserId(_id: string) { // 유저 정보 조회의 _id 타입을 schema types object id로 맞춰야 할까
    const user = await User.findOne({ _id }).populate('buddyId').populate('postId').populate('categoryId')
    return user;
  }
  // 유저 이메일 조회
  async findByEmail(email: string) {
    const user = await User.findOne({ email })
    return user;
  }
  // 유저 정보 등록 (로그인 시 최초 저장)
  async join(userData: checkUser) {
    const user = await User.create(userData);
    return user;
  }
  // 유저 정보 수정 / 해당 코드 붙여넣어서
  async update(_id: mongoose.Types.ObjectId, userdata: checkUser) {
    const user = await User.findOneAndUpdate({ _id }, userdata, { new: true }).populate('buddyId').populate('postId').populate('categoryId')
    return user;
  }
  // 회원 탈퇴 real
  async withdrawalReal(_id: string) {
    const user = await User.findOneAndDelete({ _id });
    return user;
  }

  // 프로필 사진 등록
  async updateProfileImage(email: string, profileImage?: string) {
    const result = await User.findOneAndUpdate(
      { email },
      { profileImage }, 
      { new: true }
    );
    return result;
  }
}
const userModel = new UserModel();
export default userModel;