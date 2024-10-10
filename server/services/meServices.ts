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
}

const meService = new MeService(meModel, communityModel);
export default meService;
