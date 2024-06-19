import { Schema, model } from 'mongoose';

export interface checkBuddy {
  _id?: Schema.Types.ObjectId; // mongoDB 자동 생성되는 것 오버라이딩
  userId?: Schema.Types.ObjectId;
  categoryId?: Schema.Types.ObjectId;
  name?: string;
  buddyImage?: string[];  
  age?: number | null;
  sex?: number | null;
  kind?: string | null;
  weight?: number | null;
  isNeutered?: Date | null;
  deletedAt?: Date | null;
}

const BuddySchema = new Schema(
  {
    userId: {   //user 스키마를 참조해 userId 가져옴
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    name: {       // 반려동물 이름
      type: String,
      default: true
    }, 
    buddyImage: { // 프로필 사진
      type: [String],
      default: "public/defaultbuddyImage.png"
    },
    age: {        // 나이
      type: Number,
      default: null
    },
    sex: {        // 성별
      type: Number,
      default: null
    },
    kind: {       // 종류
      type: String,
      default: null
    },
    weight: {     // 체중
      type: Number,
      default: null
    },
    isNeutered: {   // 중성화 여부
      type: Date,
      default: null
    },
    deletedAt: { // 유저 화면에 보여주나 실제로 삭제되면 안됨
      type: Date,
      default: null
    },
  },
  {
    versionKey: false,
    timestamps: true, // 등록 업데이트 자동 생성
    collection: "buddies"
  },
);

export const Buddy = model('buddies', BuddySchema)