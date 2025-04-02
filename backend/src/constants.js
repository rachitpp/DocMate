import dotenv from "dotenv";
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const _env_ = process.env.NODE_ENV;
export const COOKIE_NAME = process.env.COOKIE_NAME;
export const PORT = process.env.PORT;
export const ORIGIN = process.env.ORIGIN;
export const ORIGIN2 = process.env.ORIGIN2;