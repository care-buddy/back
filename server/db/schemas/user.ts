import mongoose, { Schema, model } from 'mongoose';
import { checkCommunity } from './community';
import { checkBuddy } from './buddy';
import dotenv from 'dotenv';
import { checkHospital } from './hospital';
import { checkComment } from './comment';

export interface checkUser {
  _id?: mongoose.Types.ObjectId; // mongoDB 자동 생성되는 것 오버라이딩
  nickName?: string;
  email?: string;
  password?: string;
  profileImage?: string | null;
  introduce?: string;
  adminNumber?: number;
  refreshToken?: string | null;
  isTempPassword?: Number;
  postId?: mongoose.Types.ObjectId[];
  buddyId?: mongoose.Types.ObjectId[];
  hospitalId?: mongoose.Types.ObjectId[];
  communityId?: mongoose.Types.ObjectId[];
  commentId?: mongoose.Types.ObjectId[];
  deletedAt?: Date;
}

const UserSchema = new Schema(
  {
    nickName: {
      // 회원 이름 (별명)
      type: String,
      required: true,
    },
    email: {
      // 이메일 (아이디)
      type: String,
      required: true,
    },
    //사용자 비밀번호
    password: {
      type: String,
      required: true, //소셜 로그인 넣을 경우에는 false
    },
    profileImage: {
      // 프로필 사진
      type: String,
      default: null,
    },
    introduce: {
      // 소개글
      type: String,
      default: '',
    },
    adminNumber: {
      // 관리자 여부
      type: Number,
      default: 0,
      required: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    isTempPassword: {
      type: Number,
      default: 0,
    },
    postId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'posts',
      },
    ],
    categoryId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'category',
      },
    ],
    commentId: [
      {
        //comment 스키마를 참조해 commentId 가져옴
        type: Schema.Types.ObjectId,
        ref: 'comments',
      },
    ],
    buddyId: [
      {
        //buddy 스키마를 참조해 categoryId 가져옴
        type: Schema.Types.ObjectId,
        ref: 'buddies',
      },
    ],
    hospitalId: [
      {
        //hospital 스키마를 참조해 hospitalId 가져옴
        type: Schema.Types.ObjectId,
        ref: 'hospitals',
      },
    ],
    communityId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'communities',
      },
    ],
    deletedAt: {
      // 유저 화면에 보여주나 실제로 삭제되면 안됨
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true, // 등록 업데이트 자동 생성
    collection: 'users',
  },
);

export const User = model('users', UserSchema);
