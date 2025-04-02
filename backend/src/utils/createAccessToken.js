import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants.js";

export const createAccessToken = (user, type) => {
    const payload = {
        _id: user._id,
        type,
        token_version: 0,
    };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};

export const createRefreshToken = (user, type) => {
    const payload = {
        _id: user._id,
        type,
        token_version: 0,
    };
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};