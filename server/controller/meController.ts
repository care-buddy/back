import { Request, Response } from 'express';
import userService from '../services/userServices';
import meService from '../services/meServices';
import mongoose from 'mongoose';
interface FileWithLocation extends Express.Multer.File {
  location?: string; // multer-s3에서 제공하는 URL
}
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

  // 사용자 계정 업데이트 로직
  // 추가적으로 업데이트, 삭제, 프로필 사진 등록/삭제 메서드를 구현할 수 있습니다.
  async updateMe(req: Request, res: Response) {
    try {
      const userId = req.user?._id; // JWT 미들웨어에서 추가된 사용자 정보
      const userData = req.body; // 클라이언트로부터 받은 사용자 정보
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: '사용자 인증이 필요합니다.' });
      }

      // 이미지 업로드 처리
      let imageUrl: string | null = null;
      /* Multer 사용하여 파일 업로드 시, req.file의 타입은 Express.Multer.File 이며 여기에 location 속성이 정의되어 있지 않습니다.
           그런데, multer-s3를 사용하여 파일을 업로드하면 s3에 업로드 된 후의 URL을 location 속성에 추가시켜 줍니다. 
           따라서 이 req.file이 위에서 생성한 interface의 FileWithLocation 타입이라고 알려줍니다. (타입캐스팅, 알려주지 않으면 인지하지 못함) */
      const file = req.file as FileWithLocation;

      // 기존 이미지가 있는지 확인
      const userInformation = await meService.getUserInformation(userId);
      const profileImage = userInformation?.profileImage;

      // 파일이고, URL이 있을 때에만 imageUrl 지정
      // 클라에서 프로필 사진 업로드하지 않은 경우에는, file을 첨부하지 않음
      if (file && file.location) {
        // req.file은 multer로 업로드된 파일 정보를 포함
        imageUrl = file.location; // S3에 업로드된 파일의 URL
      } else if (profileImage) {
        // 파일이 없다면 즉, 프로필 이미지가 전송되지 않았다면 기존 이미지를 유지
        // 프론트에서는 url로 이미지를 관리하기 때문에, 이미지 수정이 없을 때 로직을 서버에서 처리해줌
        imageUrl = profileImage;
      }

      const updatedUser = await userService.updateUser(
        new mongoose.Types.ObjectId(userId),
        { ...userData, profileImage: imageUrl },
      );
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: '사용자 정보를 업데이트하는 데 실패했습니다.',
        });
      }
      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      console.error('updateMe 에러:', error);
      res
        .status(500)
        .json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  }

  // 사용자 계정 삭제 로직
  async deleteMe(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: '사용자 인증이 필요합니다.' });
      }
      const deletedUser = await userService.deleteUser(
        new mongoose.Types.ObjectId(userId),
      );
      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: '사용자 정보를 삭제하는 데 실패했습니다.',
        });
      }
      res
        .status(200)
        .json({ success: true, message: '사용자 계정이 삭제되었습니다.' });
    } catch (error) {
      console.error('deleteMe 에러:', error);
      res
        .status(500)
        .json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  }
  // 프로필 사진 등록 로직
  async putProfileImage(req: Request, res: Response) {
    // 프로필 사진 등록 로직을 구현
    try {
      const userId = req.user?._id; // JWT 미들웨어에서 추가된 사용자 정보
      const profileImage = req.file?.filename; // 업로드된 파일 이름
      if (!userId || !profileImage) {
        return res
          .status(400)
          .json({ success: false, message: '프로필 이미지 URL이 필요합니다.' });
      }
      // userId를 ObjectId로 변환하여 사용
      const updatedUser = await userService.updateProfileImage(
        String(userId),
        profileImage,
      );
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: '프로필 사진 업데이트에 실패했습니다.',
        });
      }
      res.status(200).json({
        success: true,
        message: '이미지가 수정되었습니다.',
        data: updatedUser,
      });
    } catch (error) {
      console.error('putProfileImage 에러:', error);
      res
        .status(500)
        .json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  }

  // 프로필 사진 삭제 로직
  async deleteProfileImage(req: Request, res: Response) {
    // 프로필 사진 삭제 로직을 구현
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: '사용자 인증이 필요합니다.' });
      }
      const defaultImage = 'public/image/defaultprofileImage.png';
      const updatedUser = await userService.updateProfileImage(
        String(userId),
        defaultImage,
      ); // 기본 프로필 이미지로 업데이트
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: '프로필 사진 삭제에 실패했습니다.',
        });
      }
      res.status(200).json({
        success: true,
        message: '이미지가 삭제되었습니다.',
        data: updatedUser,
      });
    } catch (error) {
      console.error('deleteProfileImage 에러:', error);
      res
        .status(500)
        .json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  }
}

const meController = new MeController();
export default meController;
