import { Schema, model } from 'mongoose';

export interface checkCommunity {
  _id?: Schema.Types.ObjectId; // mongoDB 자동 생성되는 것 오버라이딩함
  category: number;
  community: string;
  introduction: string;
  deletedAt: Date | null;
}

const CommunitySchema = new Schema(
  {
    userId: [   // 유저 식별
      {
      type: Schema.Types.ObjectId,
      ref: "users",
      }
    ],
    category: {   // 동물 카테고리 이름 (0: 강아지, 1: 고양이)
      type: Number,
      required: true,
    },
    community: {    // 그룹 이름
      type: String,
      required: true,
    },
    introduction: {   // 그룹 소개
      type: String,
      required: true,
    },
    deletedAt: {    // 나중에 삭제되는 시간 저장
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false, // 버전 키를 사용하지 않음
    timestamps: true, // 등록 및 업데이트 시간 자동 생성
    collection: 'communities',
  },
);

export const Community = model('communities', CommunitySchema);
