import mongoose from 'mongoose';
import userModel, { UserModel } from '../db/models/userModel';
import { checkUser } from '../db/schemas/user';
import categoryModel, { CategoryModel } from '../db/models/categoryModel';

class UserService {
  userModel: UserModel;
  categoryModel: CategoryModel;
  constructor(userModel: UserModel, categoryModel: CategoryModel) {
    this.userModel = userModel;
    this.categoryModel = categoryModel;
  }

  async createUser(userData: checkUser) {
    const { email } = userData;
    const foundUser = await userModel.findByEmail(email);
    if (foundUser && foundUser.email == email) return { status: 400, err: '중복된 이메일입니다.' }

    const newUser = await userModel.join(userData);

    return newUser;
  }
  async getMyPage(_id: string) {
    const user = await this.userModel.findByUserId(_id);
    return user;
  }
  async confirmAllUser() {
    const users = await this.userModel.findAllUsers();
    return users;
  }
  async updateUser(_id: mongoose.Types.ObjectId, userdata: checkUser) {
    if (!_id) return { status: 404, err: '작업에 필요한 ID가 없습니다.' }
    const updateUser = await this.userModel.update(_id, userdata);
    if (!updateUser) return { status: 404, err: '작업에 필요한 유저가 없습니다.' }
    return updateUser;
  }
  async deleteUserReal(_id: string) {
    const deleteUser = await this.userModel.withdrawalReal(_id);
    return deleteUser;
  }

  async joinCategory(_id: string, categoryId: string) {
    const user = await this.userModel.findByUserId(_id);
    const category = await this.categoryModel.findByCategoryId(categoryId);

    if (!user) return { status: 404, err: '작업에 필요한 유저가 없습니다.' }
    else if (!category)return { status: 404, err: '작업에 필요한 카테고리가 없습니다.' }
   // 사용자가 이미 그룹에 속해있을 때
   if (user.categoryId.some((cat) => cat?._id?.equals(category._id))) return { status: 400, err: '사용자가 이미 그룹에 속해 있습니다.' }
    user.categoryId.push(category._id);
    await user.save();

    return user;
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
  
  // 프로필 사진 등록
  async updateProfileImage(email: string, profileImage?: string) {
    console.log(`${email}의 프로필을 수정합니다. [Service]`);
    const result = await this.userModel.updateProfileImage(email, profileImage);
    return result;
  }
}

const userService = new UserService(userModel, categoryModel);
export default userService;
