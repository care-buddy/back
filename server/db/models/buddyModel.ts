import mongoose from "mongoose";
import { Buddy, checkBuddy } from "../schemas/buddy";
import { User, checkUser } from "../schemas/user";

export class BuddyModel {
  // 반려동물 등록
  async createBuddy(buddyData: checkBuddy) {
    const createNewBuddies = await Buddy.create(buddyData);

    return createNewBuddies;
  }

  // 전체 반려동물 조회
  async findAllBuddies(userId: mongoose.Types.ObjectId) {
    const buddiesAllContent = await Buddy.find({ userId });
    const buddies = buddiesAllContent.map((buddies) => ({
      _id: buddies._id,
      name: buddies.name,
      kind: buddies.kind,
      birth: buddies.birth, 
      buddyImage: buddies.buddyImage, 
      createdAt: buddies.createdAt,
      deletedAt: buddies.deletedAt
    }))
    
    return buddies;
  }
  
  // 반려동물의 주인 조회
  async findUser(_id: mongoose.Types.ObjectId) {
    const user = await User.findById({ _id });
    const userName = user?.nickName;

    return userName;
  }

  // 반려동물 하나 조회
  async getBuddyById(_id: mongoose.Types.ObjectId) {
    const buddy = await Buddy.find({ _id });
    return buddy;
  }

  // 반려동물 정보 수정
  async updateBuddy(_id: mongoose.Types.ObjectId, updateData: checkBuddy) {
    const updatedBuddy = await Buddy.findOneAndUpdate({ _id }, updateData, { new: true });
    return updatedBuddy;
  }

  // 반려동물 삭제
  async deleteBuddy(_id: mongoose.Types.ObjectId) {
    const result = await Buddy.findOneAndUpdate({ _id }, { deletedAt: new Date() }, { new: true });
    return result;
  }

  // 프로필 사진 등록 및 삭제
  async updateBuddyImage(_id: mongoose.Types.ObjectId, buddyImage?: string) {
    const result = await Buddy.findOneAndUpdate(
      { _id },
      { buddyImage },
      { new: true }
    );
    return result;
  }
}

const buddyModel = new BuddyModel();
export default buddyModel;