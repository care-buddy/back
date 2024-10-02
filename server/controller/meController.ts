import { Request, Response } from 'express';

// 사용자의 정보를 반환하는 meController
class MeController {
  // 현재 로그인한 사용자 정보를 반환하는 메서드
  async getMe(req: Request, res: Response) {
    try {
      const user = req.user; // JWT 미들웨어에서 추가된 사용자 정보

      if (!user) {
        return res.status(401).json({ success: false, message: '사용자 인증이 필요합니다.' });
      }

      console.log(`** ${user._id}의 정보를 조회합니다.`, user);

      // 전체 사용자 정보를 반환
      res.status(200).json({
        success: true,
        message: user, // 사용자 정보를 그대로 반환
      });
    } catch (error) {
      console.error('me API 에러:', error);
      res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
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
