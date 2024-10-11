import { Request, Response } from 'express';
import userService from '../services/userServices';
import meService from '../services/meServices';

// 사용자의 정보를 반환하는 meController
class MeController {
  // 현재 로그인한 사용자 정보를 반환하는 메서드
  async getMe(req: Request, res: Response) {
    try {
      const user = req.user; // JWT 미들웨어에서 추가된 사용자 정보

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: '사용자 인증이 필요합니다.' });
      } else if (!user._id) {
        return res
          .status(400)
          .json({ success: false, message: '사용자 ID가 필요합니다.' });
      }

      const userInformation = await meService.getUserInformation(user._id);

      console.log(
        `** ${user._id}의 정보를 조회합니다.(meController)`,
        userInformation,
      );

      // 전체 사용자 정보를 반환
      res.status(200).json({
        success: true,
        message: userInformation, // 사용자 정보를 그대로 반환
      });
    } catch (error) {
      console.error('me API 에러:', error);
      res
        .status(500)
        .json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  }

  // 추가적으로 업데이트, 삭제, 프로필 사진 등록/삭제 메서드를 구현할 수 있습니다.
  async updateUser(req: Request, res: Response) {
    // 사용자 정보 업데이트 로직을 구현
  }

  async deleteUser(req: Request, res: Response) {
    // 사용자 계정 삭제 로직을 구현
  }

  async putProfileImage(req: Request, res: Response) {
    // 프로필 사진 등록 로직을 구현
  }

  async deleteProfileImage(req: Request, res: Response) {
    // 프로필 사진 삭제 로직을 구현
  }
}

const meController = new MeController();
export default meController;
