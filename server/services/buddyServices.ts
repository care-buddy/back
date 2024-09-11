import mongoose from 'mongoose';
import buddyModel, { BuddyModel } from '../db/models/buddyModel';
import { checkBuddy } from '../db/schemas/buddy';
import { User, checkUser } from '../db/schemas/user';
import userModel, { UserModel } from '../db/models/userModel';

class BuddyyService {
  buddyModel: BuddyModel;
  userModel: UserModel;

  constructor(buddyModel: BuddyModel, userModel: UserModel) {
    this.buddyModel = buddyModel;
    this.userModel = userModel;
  }

  // 반려동물 등록
  async createBuddy(buddyData: checkBuddy) {
    const newBuddy = await this.buddyModel.createBuddy(buddyData);
    const newDatas = await newBuddy.save();
    const user = await User.findById(newDatas.userId);
    if (user) {
      user.buddyId.push(newBuddy._id);
      await user.save();
    }
    return newBuddy;
  }

  // 전체 반려동물 조회
  async getAllBuddies(userId: mongoose.Types.ObjectId) {
    const user = await this.userModel.findByUserId(userId);
    const userName = await this.buddyModel.findUser(userId);
    const buddies = await this.buddyModel.findAllBuddies(userId);

    if (!user) {
      return { status: 404, err: '작업에 필요한 유저가 없습니다.' }
    } else if (!buddies) {
      return { status: 404, err: '작업에 필요한 동물이 없습니다.' }
    }

    return { userName, buddies };
  }

  // 반려동물 하나 조회
  async getBuddyById(_id: mongoose.Types.ObjectId) {
    const buddy = await this.buddyModel.getBuddyById(_id);
    if (!buddy) {
      return { status: 404, err: '작업에 필요한 동물이 없습니다.' }
    }
    return buddy;
  }

  // 반려동물 정보 수정
  async updateBuddy(_id: mongoose.Types.ObjectId, checkBuddy: checkBuddy) {
    let updateData: Partial<checkBuddy> = checkBuddy;

    if (checkBuddy.isNeutered !== undefined) {
      // isNeutered가 변경된 경우에만 updatedAt 필드를 업데이트
      updateData.isNeutered = new Date();
    }

    const foundBuddy = await this.buddyModel.updateBuddy(_id, updateData);
    if (!foundBuddy)
      return { status: 404, err: '작업에 필요한 반려동물이 없습니다.' };

    const users = await User.find({ buddyId: { $elemMatch: { $eq: _id } } });
    console.log(users);

    return foundBuddy;
  }

  // 반려동물 삭제
  async deleteBuddy(_id: mongoose.Types.ObjectId) {
    const deleteBuddy = await this.buddyModel.deleteBuddy(_id);
    if (!deleteBuddy) return { status: 404, err: '해당 동물이 없습니다.' };
    return deleteBuddy;
  }

  // 프로필 사진 등록 및 삭제
  async updateBuddyImage(_id: mongoose.Types.ObjectId, buddyImage?: string) {
    console.log(`${_id}의 사진을 수정합니다. [Service]`);
    const result = await this.buddyModel.updateBuddyImage(_id, buddyImage);
    return result;
  }
}

const buddyService = new BuddyyService(buddyModel, userModel);
export default buddyService;
