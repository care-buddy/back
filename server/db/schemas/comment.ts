import { Schema, model } from 'mongoose';

export interface checkComment {
  _id?: Schema.Types.ObjectId; // mongoDB 자동 생성되는 것 오버라이딩
  userId: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  text: string;
  deletedAt: Date | null;
}

const CommentSchema = new Schema(
  {
    userId: {   //user 스키마를 참조해 userId 가져옴
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    postId: {   //post 스키마를 참조해 postId 가져옴
      type: Schema.Types.ObjectId,
      ref: "posts",
      required: true
    },
    text: {     // 댓글 내용
      type: String,
      required: true
    },
    deletedAt: {    // 나중에 삭제되는 시간 저장
      type: Date,
      default: null
    }
  },
  {
    versionKey: false, // 버전 키를 사용하지 않음
    timestamps: true, // 등록 및 업데이트 시간 자동 생성
    collection: "comments"
  },
);

export const Comment = model('comments', CommentSchema);