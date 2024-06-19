import { Request, Response } from 'express';
import mongoose, { Schema } from 'mongoose';
import hospitalService from '../services/hospitalServices';

class HospitalController {
  // 병원 진료기록 등록
  async createHospital(req: Request, res: Response) {
    try {
      const datas = req.body;
      const newDate = new Date(req.body.consultationDate)

      const hospital = await hospitalService.createHospital(datas, newDate);

      res.status(201).json({ success: true, data: hospital });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 전체 병원 진료기록 조회
  async getAllHospital(req: Request, res: Response) {
    try {
      const hospitals = await hospitalService.getAllHospitals();

      res.status(200).json({ success: true, message: hospitals });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 병원 진료기록 하나 조회
  async getHospitalById(req: Request, res: Response) {
    try {
      // req의 params에서 데이터 가져옴
      const { _id } = req.params;
      const objectId = new mongoose.Types.ObjectId(_id);

      const hospital = await hospitalService.getHospitalById(objectId);

      res.status(200).json({ success: true, message: hospital });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  
  // 병원 진료기록 수정
  async updateHospital(req: Request, res: Response) {
    try {
      // req의 params과 body에서 데이터 가져옴
      const { _id } = req.params;
      const hospitalData = req.body;

      const objectId = new mongoose.Types.ObjectId(_id);

      const updateHospital = await hospitalService
        .updateHospital(objectId, hospitalData);

      res.status(200).json({ success: true, data: updateHospital });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 병원 진료기록 삭제
  async deleteHospital(req: Request, res: Response) {
    try {
      // req의 params과 body에서 데이터 가져옴
      const { _id } = req.params;

      const objectId = new mongoose.Types.ObjectId(_id);

      const deleteHospital = await hospitalService.deleteHospital(objectId);

      res.status(200).json({ success: true, data: deleteHospital });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

}

const hospitalController = new HospitalController();
export default hospitalController;