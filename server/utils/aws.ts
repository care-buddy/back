// const AWS = require('aws-sdk');
import { S3Client } from '@aws-sdk/client-s3';

// .env 파일 노션 참고하여 설정해주세요
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// credentials 검증 로직입니다
if (!accessKeyId || !secretAccessKey) {
  throw new Error(
    'AWS credentials are not properly set in environment variables.',
  );
}

// S3 설정
const s3 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region: 'ap-northeast-2',
});
export default s3;
