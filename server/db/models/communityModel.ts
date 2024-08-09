import mongoose from "mongoose";
import { Community, checkCommunity } from "../schemas/community";

export class CommunityModel {
  // 커뮤니티 생성
  async createCommunity(communityData: checkCommunity) {
    const createNewcommunity = await Community.create(communityData);
    return createNewcommunity;
  }

  // 커뮤니티 조회
  async findAllCommunities() {
    const communities = await Community.find({});
    const communityList = communities.map((communities) => ({
      _id: communities._id,
      category: communities.category,
      community: communities.community,
      introduction: communities.introduction,
      deletedAt: communities.deletedAt
    }));

    return communityList;
  }
  
  // 커뮤니티 ID 로 조회
  async findByCommunityId(_id: mongoose.Types.ObjectId) {
    const user = await Community.findOne({ _id });
    return user;
  }

}
const communityModel = new CommunityModel()
export default communityModel