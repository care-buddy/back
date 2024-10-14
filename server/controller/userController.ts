import userService from '../services/userServices';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

class UserController {
  // 마이페이지 조회 (로그인한 유저 정보 조회)
  async getMyPage(req: Request, res: Response) {
    try {
      const { id } = req.params; // 사용자 ID를 URL 파라미터로 받음
      const user = await userService.getMyPage(new mongoose.Types.ObjectId(id)); // ID로 사용자 정보 조회

      if (!user) {
        res.json({ message: "사용자를 찾을 수 없습니다." });
        return;
      }

      console.log(`** ${user._id}의 정보를 조회합니다.`, user);
      res.json({ success: true, message: user });
    } catch (error) {
      console.error('getMyPage 에러:', error);
      res.json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  }

  // 회원정보 수정
  async updateUser(req: Request, res: Response) {
    try {
      const userData = req.body;

      // 사용자 정보를 업데이트
      const updatedUser = await userService.updateUser(new mongoose.Types.ObjectId(userData._id), userData);

      if (!updatedUser) {
        res.json({ message: "사용자 정보를 업데이트하는 데 실패했습니다." });
        return;
      }

      res.json({ success: true, data: updatedUser });
    } catch (error) {
      console.error('updateUser 에러:', error);
      res.json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  }

  // 회원 탈퇴
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params; // 사용자 ID를 URL 파라미터로 받음
      const deletedUser = await userService.deleteUser(new mongoose.Types.ObjectId(id));

      if (!deletedUser) {
        res.json({ message: "사용자 정보를 삭제하는 데 실패했습니다." });
        return;
      }

      res.json({ success: true, data: deletedUser });
    } catch (error) {
      console.error('deleteUser 에러:', error);
      res.json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  }

  // 프로필 사진 등록
  async putProfileImage(req: Request, res: Response) {
    try {
      const { id } = req.params; // 사용자 ID를 URL 파라미터로 받음
      const profileImage = req.file?.filename;
      const result = await userService.updateProfileImage(id, profileImage); // ID로 프로필 이미지 업데이트
      res.json({ message: "이미지가 수정되었습니다.", data: result });
    } catch (err) {
      console.log(err);
      res.json({ message: "서버의 userController에서 에러가 났습니다." });
    }
  }

  // 프로필 사진 삭제
  async deleteProfileImage(req: Request, res: Response) {
    try {
      const { id } = req.params; // 사용자 ID를 URL 파라미터로 받음
      const profileImage = `public/image/defaultprofileImage.png`;
      const result = await userService.updateProfileImage(id, profileImage); // ID로 프로필 이미지 삭제
      res.json({ message: "이미지가 삭제되었습니다.", data: result });
    } catch (error) {
      console.log(error);
      res.json({ message: "서버의 userController에서 에러가 났습니다." });
    }
  }

  // 그룹 가입
  async joinCommunity(req: Request, res: Response) {
    const { id } = req.params; // 사용자 ID를 URL 파라미터로 받음
    const { communityId } = req.body;

    const user = await userService.joinCommunity(new mongoose.Types.ObjectId(id), communityId);
    res.json({ success: true, data: user });
  }

  // 그룹 탈퇴
  async withdrawalCommunity(req: Request, res: Response) {
    const { id } = req.params; // 사용자 ID를 URL 파라미터로 받음
    const { communityId } = req.body;

    const user = await userService.withdrawalCommunity(new mongoose.Types.ObjectId(id), communityId);
    res.json({ success: true, data: user });
  }
}

const userController = new UserController();
export default userController;
