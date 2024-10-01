import mongoose, { Schema, model } from 'mongoose';

export interface checkBuddy {
  _id?: mongoose.Types.ObjectId; // mongoDB 자동 생성되는 것 오버라이딩
  userId?: mongoose.Types.ObjectId;
  hospitalId?: mongoose.Types.ObjectId[];
  name?: string;
  buddyImage?: string;
  species?: Number | null;
  kind?: string | null;
  birth?: String | null;
  sex?: number | null;
  weight?: number | null;
  isNeutered?: Date | null;
  deletedAt?: Date | null;
}

const BuddySchema = new Schema(
  {
    userId: {
      //user 스키마를 참조해 userId 가져옴
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    hospitalId: [
      {
        //hospital 스키마를 참조해 hospitalId 가져옴
        type: Schema.Types.ObjectId,
        ref: 'hospitals',
      },
    ],
    name: {
      // 반려동물 이름
      type: String,
      default: true,
    },
    buddyImage: {
      // 프로필 사진
      type: String, // (확인하신 후 삭제) 배열로 저장할 필요가 없어서 수정했는데, 관련해서 수정 필요하면 공유해주세요
      default: null, // null 값 저장 시, 클라에서 기본 이미지로 렌더링 해줍니다.
    },
    species: {
      // 종 (0: 강아지, 1: 고양이)
      type: Number,
      required: true,
    },
    kind: {
      // 품종
      type: String,
      required: true,
    },
    birth: {
      // 생년월일
      type: String,
      default: null,
    },
    sex: {
      // 성별
      type: Number,
      default: null,
    },
    weight: {
      // 체중
      type: Number,
      default: null,
    },
    isNeutered: {
      // 중성화 여부
      type: Boolean,
      default: false, // false: 중성화 X, true: 중성화 O
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
    collection: 'buddies',
  },
);

export const Buddy = model('buddies', BuddySchema);
