import { COOKIE_NAME, _env_ } from "../constants.js";
import { createRefreshToken } from "./createAccessToken.js";

export const setCookies = (res, user, type) => {
    const token = createRefreshToken(user, type);
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: _env_ === "development" ? false : true,
        sameSite: _env_ === "development" ? "lax" : "none",
    });
};