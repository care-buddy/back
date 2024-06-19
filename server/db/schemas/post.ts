import { Schema, model } from 'mongoose';
import dotenv from 'dotenv';

export interface checkPost {
  _id?: Schema.Types.ObjectId; // mongoDB 자동 생성되는 것 오버라이딩
  userId: Schema.Types.ObjectId;
  categoryId: Schema.Types.ObjectId;
  title: string;
  content: string;
  deletedAt?: Date | null;
  isLiked: boolean;
  likeCount: number;
  postImage?: string[]
}

const PostSchema = new Schema(
  {
    userId: {   //user 스키마를 참조해 userId 가져옴
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    categoryId: {   //category 스키마를 참조해 categoryId 가져옴
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: true
    },
    title: {     // 글제목
      type: String,
      required: true
    },
    likedUsers: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    content: {    // 글 내용
      type: String,
      required: true
    },
    deletedAt: {  // 나중에 삭제되는 시간 저장
      type: Date,
      default: null
    },
    postImage:{
      type: [String],
      default: null
    }
  },
  {
    versionKey: false, // 버전 키를 사용하지 않음
    timestamps: true, // 등록 및 업데이트 시간 자동 생성
    collection: "posts"
  },
);

export const Post = model('posts', PostSchema);