import userService from '../services/userServices';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../db/schemas/user';

interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
  };
}

class UserController {
  // 회원가입
  async joinUser(req: Request, res: Response) {
    const datas = req.body;
    const user = await userService.createUser(datas);
    res.status(201).json({ success: true, data: user });
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
    const { deletedAt, ...userData } = req.body;
    const objectId = new mongoose.Types.ObjectId(_id);
    const deleteUser = await userService.updateUser(objectId, {
      ...userData,
      deletedAt: new Date(),
    });
    res.status(200).json({ success: true, data: deleteUser });
  }
  // 마이페이지
  async confirmUser(req: AuthenticatedRequest, res: Response) {

    const checkUser = await User.findOne({ email: req.user?.email })
    const { _id } = req.params;
    const user = await userService.confirmUser(_id);
    res.status(200).json({ success: true, message: user, token: String(checkUser?._id) === _id });
  }
  // 전체 유저 확인
  async confirmAllUser(req: Request, res: Response) {

    const user = await userService.confirmAllUser();
    res.status(200).json({ success: true, message: user });
  }

  // 나인거 확인
  async confirmUserMe(req: AuthenticatedRequest, res: Response) {
    const user = await User.findOne({ email: req.user?.email }).populate('buddyId').populate('postId').populate('categoryId')
    if (!user) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json({ success: true, user });
  }

  async deleteUserReal(req: Request, res: Response) {
    const { _id } = req.params;
    await userService.deleteUserReal(_id);
    res
      .status(200)
      .json({ message: '회원탈퇴가 완료되었습니다(사용할 기능 x)' });
  }

  // 그룹가입
  async joinCategory(req: Request, res: Response) {
      const { _id } = req.params;
      const { categoryId } = req.body;
      const user = await userService.joinCategory(_id, categoryId);
      res.status(200).json({ success: true, data: user });
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


  //그룹 탈퇴
  async withdrawalCategory(req: Request, res: Response) {
      const { _id } = req.params;
      const { categoryId } = req.body;
      const user = await userService.withdrawalCategory(_id, categoryId);
      res.status(200).json({ success: true, data: user });
  }
}

const userController = new UserController();
export default userController;

