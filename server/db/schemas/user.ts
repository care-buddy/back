import { Schema, model } from 'mongoose';
import { checkCategory } from './category';
import { checkBuddy } from './buddy';
import dotenv from 'dotenv';

export interface checkUser {
  //_id?: Schema.Types.ObjectId; // mongoDB 자동 생성되는 것 오버라이딩
  nickName: string;
  email: string;
  adminNumber: number;
  profileImage?: string[];
  introduce?: string;
  deletedAt: Date;
  categoryId: checkCategory
  buddyId: checkBuddy
}

const UserSchema = new Schema(
  {
    nickName: { // 회원 이름 (별명)
      type: String,
      required: true
    },
    email: { // 이메일
      type: String,
      required: true
    },
    profileImage:{   // 프로필 사진
      type: [String],
      default: "public/defaultprofileImage.png"
    },
    introduce:{     // 소개글
      type: String,
      default: "",
    }, 
    adminNumber: { // 관리자 여부
      type: Number,
      default: 0,
      required: true,
    },
    postId: [
      {
      type: Schema.Types.ObjectId,
      ref: "posts",
      }
    ],
    buddyId: [
      { //category 스키마를 참조해 categoryId 가져옴
      type: Schema.Types.ObjectId,
      ref: "buddies",
      }
    ],
    categoryId: [
      {
      type: Schema.Types.ObjectId,
      ref: "categories",
      }
    ],
    deletedAt: { // 유저 화면에 보여주나 실제로 삭제되면 안됨
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true, // 등록 업데이트 자동 생성
    collection: "users"
  },
);

export const User = model('users', UserSchema)