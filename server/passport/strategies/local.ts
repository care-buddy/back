import { Strategy as LocalStrategy } from 'passport-local';
import authService from '../../services/authService'; // 유저 인증 로직을 포함한 서비스

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await authService.validateUser(email, password);
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

export default localStrategy;
