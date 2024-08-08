import userService from '../services/userServices';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from '../db/schemas/user';
import { generateRandomCode } from '../utils/generateRandomCode';
import sendMail from '../utils/sendMail';
import { setAuthCodeToken } from '../utils/jwt';

class UserController {
  // 마이페이지
  async getMyPage(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('getMyPage 호출됨');
      //req.params._id로 유저 조회

      // req의 params에서 데이터 가져옴
      const { _id } = req.params;
      console.log('req.params._id:', _id);
      /* 
            const { email } = req.body;
            console.log('req.params.email:', email);
       */
      const objectId = new mongoose.Types.ObjectId(_id);

      const user = await userService.getMyPage(objectId);
      //const user = await userService.getUserFromEmail(email);

      if (!user) {
        return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
      }

      //일반 정보 조회
      console.log(`** ${objectId}의 정보를 조회합니다.`, user)

      res.status(200).json({ success: true, message: user });
    } catch (error) {
      console.error('getMyPage 에러:', error);
      res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.', err: error });
    }
  }

  // 회원정보 수정
  async updateUser(req: Request, res: Response) {
    const { _id } = req.params;
    const userData = req.body;
    const objectId = new mongoose.Types.ObjectId(_id);

    const updateUser = await userService.updateUser(objectId, userData);

    res.status(200).json({ success: true, data: updateUser });
  }

  // 회원 탈퇴
  async deleteUser(req: Request, res: Response) {
    const { _id } = req.params;
    const objectId = new mongoose.Types.ObjectId(_id);
    const deleteUser = await userService.deleteUser(objectId);
    res.status(200).json({ success: true, data: deleteUser });
  }
  
  // 프로필 사진 등록
  async putProfileImage(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const profileImage = req.file?.filename;
      const result = await userService.updateProfileImage(email, profileImage);
      res.status(200).json({ message: "이미지가 수정되었습니다.", data: result });
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ message: "서버의 userContrller에서 에러가 났습니다." });
    }
  }
 
  // 프로필 사진 삭제
  async deleteProfileImage(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const profileImage = `public/image/defaultprofileImage.png`;
      const result = await userService.updateProfileImage(email, profileImage);
      res.status(200).json({ message: "이미지가 삭제되었습니다.", data: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "서버의 userContrller에서 에러가 났습니다." });
    }
  }

  // 그룹 가입
  async joinCategory(req: Request, res: Response) {
    const { _id } = req.params;
    const { categoryId } = req.body;
    const objectId = new mongoose.Types.ObjectId(_id);
    const user = await userService.joinCategory(objectId, categoryId);
    res.status(200).json({ success: true, data: user });
  }

  /*  
  //그룹 탈퇴
  async withdrawalCategory(req: Request, res: Response) {
      const { _id } = req.params;
      const { categoryId } = req.body;
      const user = await userService.withdrawalCategory(_id, categoryId);
      res.status(200).json({ success: true, data: user });
  }
*/
}

const userController = new UserController();
export default userController;

