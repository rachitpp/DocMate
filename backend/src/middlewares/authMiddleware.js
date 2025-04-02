import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, COOKIE_NAME } from "../constants.js";

export const auth = (req, res, next) => {
    try {
        const authorization =
            req.headers["authorization"] || req.headers["Authorization"];
        if (!authorization) {
            throw new Error("No authorization header found");
        }
        const token = authorization.split(" ")[1];
        let user;
        try {
            user = jwt.verify(token, ACCESS_TOKEN_SECRET);
        } catch (err) {
            throw new Error("Invalid token");
        }
        if (user) {
            req.user = user;
            return next();
        } else {
            throw new Error("Couldn't verify the user.");
        }
    } catch (err) {
        res.clearCookie(COOKIE_NAME);
        return res.status(401).json({
            authFailed: true,
            error: err.message,
        });
    }
};
