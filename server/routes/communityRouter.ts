import { Router } from "express";
import communityController from "../controller/communityController";

const communityRouter = Router();

communityRouter.post("/", communityController.createCommunity);   // 커뮤니티 생성
communityRouter.get("/", communityController.getCommunities);   // 커뮤니티 조회

export default communityRouter
