import crypto from 'crypto';
import bcrypt from 'bcrypt';

const saltRounds = 10; // 해싱 강도, 높을수록 강력한 해시 생성하지만 더 많은 시간과 자원 소모

// 비밀번호 해싱 함수
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// 비밀번호 검증 함수
export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

/* 
const hashPassword = (password: string): string => {
    const hash = crypto.createHash('sha1');
    hash.update(password);
    return hash.digest('hex');
};
 */
