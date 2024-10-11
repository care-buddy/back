import mongoose from 'mongoose';
import { User } from '../schemas/user';

export class MeModel {
  static findByUserId(_id: mongoose.Types.ObjectId | undefined) {
    throw new Error('Method not implemented.');
  }

  // // userId로 사용자 조회
  // async findByUserId(_id: mongoose.Types.ObjectId) {
  //   const user = await User.findById({ _id })
  //     .populate({
  //       path: 'buddyId', // buddyId 필드에 대한 populate
  //       select: 'name kind birth', // name 필드만 선택
  //     })
  //     .select('-commentId')
  //     .populate('postId')
  //     .populate('communityId')
  //     .populate('commentId')
  //     .exec();

  //   return user;
  // }

  // userId로 사용자 조회
  async findByUserId(_id: mongoose.Types.ObjectId) {
    const user = await User.findById(_id)
      .populate({
        path: 'buddyId',
        select: 'name kind birth buddyImage',
      })
      .populate({
        path: 'postId',
        select: 'commentId communityId content title updatedAt deletedAt',
      })
      .populate({
        path: 'communityId',
        select: 'community category',
      })
      .select('-commentId')
      .exec();

    return user;
  }
}
const meModel = new MeModel();
export default meModel;
