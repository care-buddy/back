import { Schema, model } from 'mongoose';

export interface checkHospital {
  _id?: Schema.Types.ObjectId; // mongoDB 자동 생성되는 것 오버라이딩
  userId?: Schema.Types.ObjectId;
  buddyId?: Schema.Types.ObjectId;
  doctorName?: string | null;
  address?: string | null;
  consultationStatus?: boolean | null;
  consultationDate?: Date | null;
  hospitalizationStatus?: boolean | null;
  disease?: String;
  symptom?: string[] | null;
  treatment?: string[] | null;
  memo?: string | null;
  deletedAt?: Date | null;
}

const HospitalSchema = new Schema(
  {
    userId: {
      //user 스키마를 참조해 userId 가져옴
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    buddyId: {
      //buddy 스키마를 참조해 buddyId 가져옴
      type: Schema.Types.ObjectId,
      ref: 'buddies',
      required: true,
    },
    doctorName: {
      // 의사 이름
      type: String,
      default: null,
    },
    address: {
      // 병원 주소
      type: String,
      default: null,
    },
    consultationStatus: {
      // 진단 확인 여부 (데이터가 들어온 날을 저장. 데이터가 들어있으면 진단 받음.)
      type: Boolean,
      default: null,
    },
    consultationDate: {
      // 상담 날짜/시간
      type: Date,
      default: null,
    },
    hospitalizationStatus: {
      // 입원 여부 (데이터가 들어온 날을 저장. 데이터가 들어있으면 입원함.)
      type: Boolean,
      default: null,
    },
    disease: {
      // 질병
      type: String,
      default: true,
    },
    symptom: [
      {
        // 증상
        type: String,
        default: null,
      },
    ],
    treatment: [
      {
        // 치료/처방
        type: String,
        default: null,
      },
    ],
    memo: {
      // 메모
      type: String,
      default: null,
    },
    deletedAt: {
      // 유저 화면에 보여주나 실제로 삭제되면 안됨
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true, // 등록 업데이트 자동 생성
    collection: 'hospitals',
  },
);

export const Hospital = model('hospitals', HospitalSchema);
