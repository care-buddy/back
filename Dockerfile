# 베이스 이미지로 Node.js 사용
FROM node:16-alpine

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 종속성 설치
RUN npm install

# 앱 소스 코드 복사
COPY . ./

# 타입스크립트 설정 복사 및 컴파일
COPY tsconfig.json ./
COPY . ./
RUN npm run build

# 포트 설정
EXPOSE 3001

# 애플리케이션 시작
CMD ["node", "dist/index.js"]