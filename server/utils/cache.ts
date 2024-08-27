// 인증번호와 만료 시간을 저장하기 위한 메모리 캐시
interface AuthCodeData {
  code: string;
  expiresAt: number;
}

const authCodeCache: { [email: string]: AuthCodeData } = {};

export default authCodeCache;
