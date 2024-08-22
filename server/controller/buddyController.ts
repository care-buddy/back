import { Request, Response } from 'express';
import mongoose, { Schema } from 'mongoose';
import buddyService from '../services/buddyServices';

interface FileWithLocation extends Express.Multer.File {
  location?: string; // multer-s3에서 제공하는 URL
}

class BuddyController {
  // 반려동물 등록
  async createBuddy(req: Request, res: Response) {
    try {
      // 기존 변수
      // const datas = req.body;
      // const birthDate = datas.birth;
      const { birth, image, ...datas } = req.body;

      // postman 테스트 용으로 만들어 둔 날짜 변환 로직
      // 년(birthYear), 월(birthMonth), 일(birthDay) 로 필드 변경 시, 그에 맞게 변환 필요할 것 같습니다
      let birthDate: Date | null = null;
      if (birth) {
        const parsedDate = new Date(birth);
        if (!isNaN(parsedDate.getTime())) {
          // 유효한 날짜인지 확인
          birthDate = parsedDate;
        } else {
          throw new Error('Invalid date format provided.');
        }
      }

      // 이미지 업로드 처리
      let imageUrl: string | null = null;
      /* Multer 사용하여 파일 업로드 시, req.file의 타입은 Express.Multer.File 이며 여기에 location 속성이 정의되어 있지 않습니다.
       그런데, multer-s3를 사용하여 파일을 업로드하면 s3에 업로드 된 후의 URL을 location 속성에 추가시켜 줍니다. 
       따라서 이 req.file이 위에서 생성한 interface의 FileWithLocation 타입이라고 알려줍니다. (타입캐스팅, 알려주지 않으면 인지하지 못함) */
      const file = req.file as FileWithLocation;

      // 파일이고, URL이 있을 때에만 imageUrl 지정
      // 클라에서 프로필 사진 업로드하지 않은 경우에는, file을 첨부하지 않음
      if (file && file.location) {
        // req.file은 multer로 업로드된 파일 정보를 포함
        imageUrl = file.location; // S3에 업로드된 파일의 URL
      }

      const buddy = await buddyService.createBuddy({
        ...datas,
        birth: birthDate,
        buddyImage: imageUrl, // S3 URL
      });

      res.status(201).json({ success: true, data: buddy._id });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 반려동물 전체 조회
  async getAllBuddy(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const buddy = await buddyService.getAllBuddies(userId);

      res.status(200).json({ success: true, message: buddy });
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
      const { _id } = req.params;
      const {
        buddyImage,
        species,
        kind,
        birth,
        sex,
        weight,
        isNeutered,
        deletedAt,
      } = req.body;

      const objectId = new mongoose.Types.ObjectId(_id);

      const updateBuddy = await buddyService.updateBuddy(objectId, {
        buddyImage,
        species,
        kind,
        birth,
        sex,
        weight,
        isNeutered,
        deletedAt,
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
      res
        .status(200)
        .json({ message: '이미지가 수정되었습니다.', data: result });
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ message: '서버의 buddyContrller에서 에러가 났습니다.' });
    }
  }

  // 프로필 사진 삭제
  async deleteBuddyImage(req: Request, res: Response) {
    try {
      const { _id } = req.params;
      const buddyImage = `public/image/defaultbuddyImage.png`;
      const objectId = new mongoose.Types.ObjectId(_id);

      const result = await buddyService.updateBuddyImage(objectId, buddyImage);
      res
        .status(200)
        .json({ message: '이미지가 삭제되었습니다.', data: result });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: '서버의 buddyContrller에서 에러가 났습니다.' });
    }
  }
}

const buddyController = new BuddyController();
export default buddyController;
