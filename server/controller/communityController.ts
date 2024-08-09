import communityService from '../services/communityServices';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

class CommunityController {
  // 커뮤니티 생성
  async createCommunity(req: Request, res: Response) {
    const datas = req.body;
    const community = await communityService.createCommunity(datas);
    console.log(community);
    res.status(201).json({ success: true, message: "커뮤니티가 등록되었습니다." });
  }

  // 커뮤니티 조회
	async getCommunities(req: Request, res: Response) {
		const communities = await communityService.confirmAllCommunities()
		res.status(200).json({ success: true, data: communities });
  }
}
const communityController = new CommunityController();
export default communityController;