import mongoose from "mongoose";
import communityModel, { CommunityModel } from "../db/models/communityModel";
import { checkCommunity } from "../db/schemas/community";

class CommunityService {
  communityModel: CommunityModel;
  constructor(communityModel: CommunityModel) {
    this.communityModel = communityModel;
  }

  // 커뮤니티 생성
  async createCommunity(communityData: checkCommunity) {
    const newCommunity = await this.communityModel.createCommunity(communityData);
    return newCommunity;
  }

  // 전체 커뮤니티 조회
  async confirmAllCommunities() {
    const communities = await this.communityModel.findAllCommunities()
    return communities;
  }
}

const communityService = new CommunityService(communityModel);
export default communityService;