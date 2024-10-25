import mongoose from 'mongoose';
import meModel, { MeModel } from '../db/models/meModel';
import communityModel, { CommunityModel } from '../db/models/communityModel';

class MeService {
  meModel: MeModel;
  communityModel: CommunityModel;

  constructor(meModel: MeModel, communityModel: CommunityModel) {
    this.meModel = meModel;
    this.communityModel = communityModel;
  }

  // userState용 회원정보 조회
  async getUserInformation(_id: mongoose.Types.ObjectId) {
    const user = await this.meModel.findByUserId(_id);
    console.log(user);
    return user;
  }

  // 회원 계정 삭제
  async deleteUser(_id: mongoose.Types.ObjectId) {
    // 1. 사용자 존재 여부 확인
    const user = await this.meModel.findByUserId(_id);
    if (!user) {
      return { status: 404, err: '해당 유저를 찾을 수 없습니다.' };
    }

    // 2. 사용자 삭제
    const deletedUser = await this.meModel.deleteUser(_id);
    if (!deletedUser) {
      return { status: 500, err: '사용자 정보를 삭제하는 데 실패했습니다.' };
    }

    // 3. 성공 메시지 반환
    return { status: 200, data: '사용자 계정이 성공적으로 삭제되었습니다.' };
  }
}

const meService = new MeService(meModel, communityModel);
export default meService;
