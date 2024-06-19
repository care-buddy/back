import mongoose from "mongoose";
import hospitalModel, { HospitalModel } from "../db/models/hospitalModel";
import { checkHospital } from "../db/schemas/hospital";

class HospitalService {
  hospitalModel: HospitalModel;

  constructor(hospitalModel: HospitalModel) {
    this.hospitalModel = hospitalModel;
  }

  // 병원 진료기록 등록
  async createHospital(hospitalData: checkHospital, newDate: any) {
    hospitalData.consultationDate = newDate
    const newHospital = await this.hospitalModel.createHospital(hospitalData);
    return newHospital;
  }

  // 전체 병원 진료기록 조회
  async getAllHospitals() {
    const hospitals = await this.hospitalModel.findAll();
    return hospitals;
  }

  // 병원 진료기록 하나 조회
  async getHospitalById(_id: mongoose.Types.ObjectId) {
    const hospital = await hospitalModel.getHospitalById(_id);
    return hospital;
  }

  // 병원 진료기록 수정
  async updateHospital(_id: mongoose.Types.ObjectId, hospitalData: checkHospital) {

    const foundHospital = await this.hospitalModel.updateAndDeleteHospital(_id, hospitalData);

    if (!foundHospital) return { status: 404, err: '작업에 필요한 병원 진료기록이 없습니다.' }
    if (hospitalData.deletedAt) return { status: 404, err: '작업에 필요한 병원 진료기록이 없습니다.' }

    return foundHospital;
  }

  // 병원 진료기록 삭제
  async deleteHospital(_id: mongoose.Types.ObjectId) {
    const foundHospital = await this.hospitalModel.deleteHospital(_id);
    if (!foundHospital) return { status: 404, err: '작업에 필요한 병원 진료기록이 없습니다.' }
    
    return foundHospital;
  }
}

const hospitalService = new HospitalService(hospitalModel);
export default hospitalService;