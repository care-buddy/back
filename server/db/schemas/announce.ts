import { Schema, model } from 'mongoose';

export interface checkAnnounce {
  _id?: Schema.Types.ObjectId; // mongoDB 자동 생성되는 것 오버라이딩
  content: string;
  readAt: Date | null;
  deletedAt: Date | null;
}

const AnnounceSchema = new Schema(
  {
    content: {     // 알림 내용
      type: String,
      required: true
    },
    readAt: {    // 나중에 알림 읽는 시간 저장
      type: Date,
      default: null
    },
    deletedAt: {    // 나중에 삭제되는 시간 저장
      type: Date,
      default: null
    }
  },
  {
    versionKey: false, // 버전 키를 사용하지 않음
    timestamps: true, // 등록 및 업데이트 시간 자동 생성
    collection: "announces"
  },
);

export const Announce = model('announces', AnnounceSchema);