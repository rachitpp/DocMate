import mongoose from "mongoose";
import { COOKIE_NAME, REFRESH_TOKEN_SECRET } from "../constants.js";
import Doctor from "../models/Doctor.js";
import Hospital from "../models/Hospital.js";
import Patient from "../models/Patient.js";
import { createAccessToken } from "../utils/createAccessToken.js";
import { hashPassword } from "../utils/hashPassword.js";
import { setCookies } from "../utils/setCookies.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const getPincodes = async (req, res) => {
    const pincodes = await Hospital.distinct("pincode").exec();
    return res.send(pincodes);
}

export const getHospitals = async (req, res) => {
    const { pincode } = req.query;
    if (pincode) {
        const hospitals = await Hospital.find({ pincode }).select("hospitalName").exec();
        return res.send(hospitals);
    }
    return res.send([]);
}

export const getDoctors = async (req, res) => {
    try{
        let { hospitalId } = req.query;
        if (hospitalId) {
            hospitalId = new mongoose.Types.ObjectId(hospitalId);
            const doctors = await Doctor.find({ hospital: hospitalId }).select("name").exec();
            return res.send(doctors);
        }
        return res.send([]);
    } catch (e) {
        console.log(e.message)
        return res.send([]);
    }
}

export const register = async (req, res) => {
    try {
        const { name, email, password, mobile_number, gender, type, hospital, pincode, height, weight, dob } = req.body;
        if (!type || (type !== "doctor" && type !== "patient")) {
            return res.status(400).json({ message: "invalid user type" });
        }

        let userModel, userType;
        if (type === "doctor") {
            userModel = Doctor;
            userType = "doctor";
        } else {
            userModel = Patient;
            userType = "patient";
        }

        const newUser = new userModel({
            name,
            email,
            password: await hashPassword(password),
            mobile_number,
            gender,
            hospital: type === "doctor" ? hospital : undefined,
            pincode: type === "patient" ? pincode : undefined,
            height: type === "patient" ? height : undefined,
            weight: type === "patient" ? weight : undefined,
            dob: type === "patient" ? dob : undefined
        });

        const savedUser = await newUser.save();
        let objectUser = savedUser.toObject();
        objectUser = { ...objectUser, userType }
        delete objectUser.password;
        setCookies(res, objectUser, userType);

        return res.status(201).json({
            message: `${userType} registered successfully`,
            user: objectUser,
            accessToken: createAccessToken(objectUser, userType),
            error: false
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred", error: true });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const User = role === 'doctor' ? Doctor : Patient;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found", error: true });
        }
        const passwordMatch = await bcryptjs.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect password", error: true });
        }
        let userObject = user;
        delete userObject.password;
        setCookies(res, userObject, role);
        return res.status(200).json({
            user: userObject,
            accessToken: createAccessToken(userObject, role),
            message: "User logged in",
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "An error occurred while logging in" });
    }
}

export const refreshToken = async (req, res) => {
    const token = req.cookies.docmate;
    let payload;
    try {
        if (!token) {
            throw new Error("No token");
        }
        try {
            payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
        } catch (err) {
            console.log(err);
            throw new Error("Invalid token");
        }
        const User = payload.type === 'doctor' ? Doctor : Patient;
        const user = await User.findById(payload._id);
        if (!user) {
            throw new Error("User does not exist");
        }
        setCookies(res, user, payload.type);
        return res.status(200).json({
            accessToken: createAccessToken(user, payload.type),
            msg: "Token refreshed.",
        });
    } catch (err) {
        res.clearCookie(COOKIE_NAME);
        return res.status(401).json({
            authFailed: true,
            error: err.message,
        });
    }
};

export const me = async (req, res) => {
    try {
        const u = req.user;
        const User = req.user.type === 'doctor' ? Doctor : Patient;
        const user = await User.findById(u._id).exec();
        const repUser = user.toObject();
        delete repUser.password;
        if (user) {
            res.status(200).json({
                user: repUser,
                accessToken: createAccessToken(user, req.user.type)
            });
        } else {
            return res.status(400).json({
                error: "User does not exist.",
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Could not fetch user.",
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("docmate", "", {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure: _env_ === "development" ? false : true,
            sameSite: _env_ === "development" ? "lax" : "none",
        });
        return res.status(200).json({
            msg: "User logged out.",
        });
        res.end();
    } catch (err) {
        return res.status(400).json({
            error: "Error logging out.",
        });
    }
}