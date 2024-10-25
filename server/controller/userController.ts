import userService from '../services/userServices';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

class UserController {
  // 마이페이지 조회 (로그인한 유저 정보 조회)
  async getMyPage(req: Request, res: Response) {
    try {
      const { _id } = req.params; // 사용자 ID를 URL 파라미터로 받음
      const user = await userService.getMyPage(new mongoose.Types.ObjectId(_id)); // ID로 사용자 정보 조회
      console.log('찾은 사용자:', user); // 확인용 로그 추가

      if (!user) {
        return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다." });
      }

      console.log(`** ${user._id}의 정보를 조회합니다.`, user);
      res.status(200).json({ success: true, message: user });
    } catch (error) {
      console.error('getMyPage 에러:', error);
      res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  }

  // 회원정보 수정
  async updateUser(req: Request, res: Response) {
    try {
      const userData = req.body;

      // 사용자 정보를 업데이트
      const updatedUser = await userService.updateUser(new mongoose.Types.ObjectId(userData._id), userData);

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "사용자 정보를 업데이트하는 데 실패했습니다." });
      }

      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      console.error('updateUser 에러:', error);
      res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  }

  // 회원 탈퇴
  async deleteUser(req: Request, res: Response) {
    try {
      const { _id } = req.params; // 사용자 ID를 URL 파라미터로 받음
      const deletedUser = await userService.deleteUserAccount(new mongoose.Types.ObjectId(_id));

      if (!deletedUser) {
        return res.status(404).json({ success: false, message: "사용자 정보를 삭제하는 데 실패했습니다." });
      }

      res.status(200).json({ success: true, message: '사용자 계정이 삭제되었습니다.', data: deletedUser });
    } catch (error) {
      console.error('deleteUser 에러:', error);
      res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  }

  // 프로필 사진 등록
  async putProfileImage(req: Request, res: Response) {
    try {
      const { id } = req.params; // 사용자 ID를 URL 파라미터로 받음
      const profileImage = req.file?.filename;

      if (!profileImage) {
        return res.status(400).json({ success: false, message: '프로필 이미지가 필요합니다.' });
      }

      const result = await userService.updateProfileImage(id, profileImage); // ID로 프로필 이미지 업데이트

      res.status(200).json({ success: true, message: "이미지가 수정되었습니다.", data: result });
    } catch (error) {
      console.error('putProfileImage 에러:', error);
      res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  }

  // 프로필 사진 삭제
  async deleteProfileImage(req: Request, res: Response) {
    try {
      const { id } = req.params; // 사용자 ID를 URL 파라미터로 받음
      const profileImage = 'public/image/defaultprofileImage.png';
      const result = await userService.updateProfileImage(id, profileImage); // ID로 프로필 이미지 삭제

      res.status(200).json({ success: true, message: "이미지가 삭제되었습니다.", data: result });
    } catch (error) {
      console.error('deleteProfileImage 에러:', error);
      res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  }

  // 그룹 가입
  async joinCommunity(req: Request, res: Response) {
    const { _id } = req.params; // 사용자 ID를 URL 파라미터로 받음
    const { communityId } = req.body;

    const user = await userService.joinCommunity(new mongoose.Types.ObjectId(_id), communityId);
    res.status(200).json({ success: true, data: user });
  }

  // 그룹 탈퇴
  async withdrawalCommunity(req: Request, res: Response) {
    const { _id } = req.params; // 사용자 ID를 URL 파라미터로 받음
    const { communityId } = req.body;

    const user = await userService.withdrawalCommunity(new mongoose.Types.ObjectId(_id), communityId);
    res.status(200).json({ success: true, data: user });
  }
}

const userController = new UserController();
export default userController;
