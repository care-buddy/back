import { Request, Response } from 'express';
import mongoose, { Schema } from 'mongoose';
import buddyService from "../services/buddyServices";

class BuddyController {
  // 반려동물 등록
  async createBuddy(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      const datas = req.body;

      const buddy = await buddyService.createBuddy({userId, ...datas});

      res.status(201).json({ success: true, data: buddy._id });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 반려동물 전체 조회
  async getAllBuddy(req: Request, res: Response) {
    try {
      const userId = req.user?._id;

      if (!userId) {
        res.status(400).send({ message: '유저 정보를 찾을 수 없습니다.' });
        return;
      }

      console.log(userId);

      const buddies = await buddyService.getAllBuddies(userId);

        res.status(200).json({ success: true, message: buddies });
      } catch (err: any) {
        res.status(500).json({ err: err.message });
      }
    }

  // 반려동물 하나 조회
  async getBuddyById(req: Request, res: Response) {
      try {
        // req의 params에서 데이터 가져옴
        const { _id } = req.params;
  
        const objectId = new mongoose.Types.ObjectId(_id);

        const buddy = await buddyService.getBuddyById(objectId);

        res.status(200).json({ success: true, message: buddy });
      } catch (err: any) {
        res.status(500).json({ err: err.message });
      }
    }

  // 반려동물 정보 수정 및 삭제
  async updateBuddy(req: Request, res: Response) {
      try {
        // req의 params과 body에서 데이터 가져옴
        const { _id } = req.params;   // buddyId
        const {
          name,
          species,
          kind,
          birth,
          sex,
          weight,
          isNeutered,
          buddyImage,
          deletedAt
        } = req.body;

        const objectId = new mongoose.Types.ObjectId(_id);

        const updateBuddy = await buddyService.updateBuddy(objectId, {
          name,
          species,
          kind,
          birth,
          sex,
          weight,
          isNeutered,
          buddyImage,
          deletedAt
        });

        res.status(200).json({ success: true, data: updateBuddy });
      } catch (err: any) {
        res.status(500).json({ err: err.message });
      }
    }

  // 반려동물 삭제
  async deleteBuddy(req: Request, res: Response) {
      try {
        const { _id } = req.params;

        const objectId = new mongoose.Types.ObjectId(_id);

        const deleteBuddy = await buddyService.deleteBuddy(objectId);
        res.status(200).json({ success: true, data: deleteBuddy });
      } catch (err: any) {
        res.status(500).json({ err: err.message });
      }
    }

  // 프로필 사진 등록
  async putBuddyImage(req: Request, res: Response) {
      try {
        const { _id } = req.params;
        const buddyImage = req.file?.filename;
        const objectId = new mongoose.Types.ObjectId(_id);
        const result = await buddyService.updateBuddyImage(objectId, buddyImage);
        res.status(200).json({ message: "이미지가 수정되었습니다.", data: result });
      } catch (err: any) {
        console.log(err);
        res.status(500).json({ message: "서버의 buddyContrller에서 에러가 났습니다." });
      }
    }

  // 프로필 사진 삭제
  async deleteBuddyImage(req: Request, res: Response) {
      try {
        const { _id } = req.params;
        const buddyImage = `public/image/defaultbuddyImage.png`;
        const objectId = new mongoose.Types.ObjectId(_id);

        const result = await buddyService.updateBuddyImage(objectId, buddyImage);
        res.status(200).json({ message: "이미지가 삭제되었습니다.", data: result });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "서버의 buddyContrller에서 에러가 났습니다." });
      }
    }
  }

  const buddyController = new BuddyController();
export default buddyController;