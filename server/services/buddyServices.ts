import mongoose from 'mongoose';
import buddyModel, { BuddyModel } from '../db/models/buddyModel';
import { checkBuddy } from '../db/schemas/buddy';
import { User } from '../db/schemas/user';

class BuddyyService {
  buddyModel: BuddyModel;

  constructor(buddyModel: BuddyModel) {
    this.buddyModel = buddyModel;
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
  async getAllBuddies() {
    const buddies = await this.buddyModel.findAllBuddies();
    return buddies;
  }

  // 반려동물 하나 조회
  async getBuddyById(_id: mongoose.Types.ObjectId) {
    const buddy = await this.buddyModel.getBuddyById(_id);
    return buddy;
  }

  // 반려동물 정보 수정 및 삭제
  async updateAndDeleteBuddy(
    _id: mongoose.Types.ObjectId,
    checkBuddy: checkBuddy,
  ) {
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
    // buddyId: [ new ObjectId('661f448ec0e61e44f16722fa') ],
    // users.forEach(async (user:any) => {
    //     // 해당 Buddy의 정보를 업데이트합니다.
    //     if (checkBuddy.profileImage) user.profileImage = checkBuddy.profileImage;
    //     if (checkBuddy.age) user.age = checkBuddy.age;
    //     if (checkBuddy.sex) user.sex = checkBuddy.sex;
    //     if (checkBuddy.kind) user.kind = checkBuddy.kind;
    //     if (checkBuddy.weight) user.weight = checkBuddy.weight;
    //     await user.save();
    // });

    return foundBuddy;
  }

  // 반려동물 삭제
  async deleteBuddy(_id: mongoose.Types.ObjectId) {
    const deleteBuddy = await this.buddyModel.deleteBuddy(_id);
    const users = await User.find({ buddyId: { $elemMatch: { $eq: _id } } });
    users.forEach(async (user) => {
      const index = user.buddyId.indexOf(_id);
      if (index !== -1) {
        user.buddyId.splice(index, 1);
        await user.save();
      }
    });
    return deleteBuddy;
  }

  // 프로필 사진 등록
  async updateBuddyImage(_id: mongoose.Types.ObjectId, buddyImage?: string) {
    console.log(`${_id}의 사진을 수정합니다. [Service]`);
    const result = await this.buddyModel.updateBuddyImage(_id, buddyImage);
    return result;
  }
}

const buddyService = new BuddyyService(buddyModel);
export default buddyService;
