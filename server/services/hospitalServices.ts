import mongoose from "mongoose";
import hospitalModel, { HospitalModel } from "../db/models/hospitalModel";
import buddyModel, { BuddyModel } from '../db/models/buddyModel';
import { Buddy, checkBuddy } from '../db/schemas/buddy';
import { checkHospital } from "../db/schemas/hospital";
import { User } from "../db/schemas/user";

class HospitalService {
  hospitalModel: HospitalModel;
  buddyModel: BuddyModel;

  constructor(hospitalModel: HospitalModel, buddyModel: BuddyModel) {
    this.hospitalModel = hospitalModel;
    this.buddyModel = buddyModel;
  }

  // 병원 진료기록 등록
  async createHospital(hospitalData: checkHospital) {
    const newHospital = await this.hospitalModel.createHospital(hospitalData);
    const newDatas = await newHospital.save();
    const user = await User.findById(newDatas.userId);
    const buddy = await Buddy.findById(newDatas.buddyId);
    if (user) {
      user.hospitalId.push(newHospital._id);
      await user.save();
    }
    if (buddy) {
      buddy.hospitalId.push(newHospital._id);
      await buddy.save();
    }
    return newHospital;
  }

  // 전체 병원 진료기록 조회
  async getAllHospitals(buddyId: mongoose.Types.ObjectId) {
    const buddy = await this.buddyModel.getBuddyById(buddyId);
    const hospitals = await this.hospitalModel.findAllByBuddyId(buddyId);
    if (!buddy) {
      return { status: 404, err: '작업에 필요한 동물이 없습니다.' }
    }
    return hospitals;
  }

  // 병원 진료기록 하나 조회
  async getHospitalById(_id: mongoose.Types.ObjectId) {
    const hospital = await hospitalModel.getHospitalById(_id);
    return hospital;
  }

  // 병원 진료기록 수정
  async updateHospital(_id: mongoose.Types.ObjectId, hospitalData: checkHospital) {

    const foundHospital = await this.hospitalModel.updateHospital(_id, hospitalData);

    if (!foundHospital) return { status: 404, err: '작업에 필요한 병원 진료기록이 없습니다.' }
    if (hospitalData.deletedAt) return { status: 404, err: '작업에 필요한 병원 진료기록이 없습니다.' }

    await Buddy.find({ hospitalId: { $elemMatch: { $eq: _id } } });

    return foundHospital;
  }

  // 병원 진료기록 삭제
  async deleteHospital(_id: mongoose.Types.ObjectId) {
    const foundHospital = await this.hospitalModel.deleteHospital(_id);
    if (!foundHospital) return { status: 404, err: '작업에 필요한 병원 진료기록이 없습니다.' }
    
    return foundHospital;
  }
}

const hospitalService = new HospitalService(hospitalModel, buddyModel);
export default hospitalService;