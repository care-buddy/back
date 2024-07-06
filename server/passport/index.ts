import passport from "passport";
import { accessJwt, refreshJwt } from "./strategies/jwt";

// jwt strategy 사용
passport.use('access', accessJwt);
passport.use('refresh', refreshJwt);

export default passport;