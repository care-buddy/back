import mongoose from "mongoose";
import { Buddy, checkBuddy } from "../schemas/buddy";

export class BuddyModel {
  // 반려동물 등록
  async createBuddy(buddyData: checkBuddy) {
    const createNewBuddies = await Buddy.create(buddyData);

    return createNewBuddies;
  }

  // 전체 반려동물 조회
  async findAllBuddies() {
    const buddies = await Buddy.find({});
    return buddies;
  }

  // 반려동물 하나 조회
  async getBuddyById(_id: mongoose.Types.ObjectId) {
    const buddy = await Buddy.find({_id});
    return buddy;
  }

  // 반려동물 정보 수정 및 삭제
  async updateBuddy(_id: mongoose.Types.ObjectId, updateData: checkBuddy) {
    const updatedBuddy = await Buddy.findOneAndUpdate(
      { _id }, 
      updateData, 
      { new: true }
      )
    return updatedBuddy;
  }

  // 반려동물 삭제
  async deleteBuddy(_id: mongoose.Types.ObjectId) {
    const result = await Buddy.deleteOne({ _id});
    return result;
  }

  // 사진 등록
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