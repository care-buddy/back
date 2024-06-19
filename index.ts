import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import nunjucks from 'nunjucks';
import cookieParser from 'cookie-parser';
import router from './server/routes';
import errorHandler from './server/middlewares/error';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

app.use('/uploads', express.static('uploads'));

/* 
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.header(
    'Access-Control-Allow-Origin',
    'http://kdt-sw-8-team01.elicecoding.com/',
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
 */
dotenv.config();

const { MONGODB_PASSWORD, PORT } = process.env;

mongoose.connect(
  `mongodb+srv://carebuddy2024:${MONGODB_PASSWORD}@carebuddy2.2tuoqpb.mongodb.net/`,
);

mongoose.connection.on('connected', () => {
  console.log('Successfully connected to MongoDB');
});

app.set('view engine', 'html');     //  HTML 파일을 사용할 것이므로 view engine 속성을 "html"로 설정

// 템플릿 파일이 위치한 디렉터리를 지정
// express 속성에 Express 애플리케이션 객체를 전달하여 Nunjucks가 Express와 함께 작동
nunjucks.configure('views', { express: app, watch: true });

app.use(cookieParser());
app.use(router);
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('OK');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT || 3001}`);
});
