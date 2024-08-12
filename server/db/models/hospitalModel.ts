import mongoose from "mongoose";
import { Hospital, checkHospital } from "../schemas/hospital";

export class HospitalModel {
  // 병원 진료기록 등록
  async createHospital(hospitalData: checkHospital) {
    const createNewHospital = await Hospital.create(hospitalData);
    return createNewHospital;
  }

  // 전체 병원 진료기록 조회
  async findAllByBuddyId(buddyId: mongoose.Types.ObjectId) {
    const hospitals = await Hospital.find({ buddyId });
    return hospitals;
  }

  // 병원 진료기록 하나 조회
  async getHospitalById(_id: mongoose.Types.ObjectId) {
    const hospital = await Hospital.find({ _id });
    return hospital;
  }

  // 병원 진료기록 수정 및 삭제
  async updateHospital(_id: mongoose.Types.ObjectId, updateData: checkHospital) {
    const updatedHospital = await Hospital.findOneAndUpdate({ _id }, updateData, { new: true });
    return updatedHospital;
  }

  // 병원 진료기록 삭제
  async deleteHospital(_id: mongoose.Types.ObjectId) {
    const deletedHospital = await Hospital.findOneAndUpdate({ _id }, { deletedAt: new Date() }, { new: true });
    console.log(_id);
    return deletedHospital;
  }
}

const hospitalModel = new HospitalModel();
export default hospitalModel;