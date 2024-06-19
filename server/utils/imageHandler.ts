import multer from "multer";
import path from "path";

// 파일 저장 경로 및 파일 이름 지정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname); // 확장자 추출
    const newFileName = `${file.fieldname}-${Date.now()}${extension}`; // 새로운 파일 이름 생성(중복 없게 Date.now + 확장자)
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

export default upload;