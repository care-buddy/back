import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../utils/aws';
import { v4 as uuidv4 } from 'uuid';

// multerS3를 사용하여 파일 업로드를 처리하여 S3에 아래 설정으로 저장하게 해주는 모듈
const uploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME!,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: 'inline', // 다운로드 대신 브라우저에서 열리도록 설정
    key: function (req, file, cb) {
      // uuid로 고유 id를 생성했는데 기존 업로더에서는 Date()로 고유성을 주신 것 같아서, 원하시는 방향으로 사용해주세요!
      cb(null, `${uuidv4()}-${file.originalname}`);
    },
    // limits: { fileSize: 5 * 1024 * 1024 } // limits 사용 시, 최대 파일 사이즈 (5MB) 와 같이 파일 사이즈 제한을 걸 수 있습니다. 필요 시 활성화 해주세요!
  }),
});

export default uploader;
