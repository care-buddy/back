import { Strategy as LocalStrategy } from 'passport-local';
import userService from '../../services/userServices'; // 유저 인증 로직을 포함한 서비스

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await userService.validateUser(email, password);
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
