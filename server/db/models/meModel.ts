import mongoose from 'mongoose';
import { User } from '../schemas/user';

export class MeModel {
  // userId로 사용자 조회
  async findByUserId(_id: mongoose.Types.ObjectId) {
    const user = await User.findById(_id)
      .populate({
        path: 'buddyId',
        select: 'name kind birth buddyImage deletedAt',
      })
      .populate({
        path: 'postId',
        select:
          'commentId communityId content title createdAt updatedAt deletedAt',
        populate: {
          path: 'communityId',
          select: 'community category',
        },
      })
      .populate({
        path: 'communityId',
        select: 'community category',
      })
      .select('-commentId')
      .exec();

    return user;
  }

  // 사용자 계정 삭제
  async deleteUser(_id: mongoose.Types.ObjectId) {
    const deletedUser = await User.findByIdAndDelete(_id);
    return deletedUser;
  }
}

const meModel = new MeModel();
export default meModel;
