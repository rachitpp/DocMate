import { Router } from "express";
import { getDoctors, getHospitals, getPincodes, login, logout, me, refreshToken, register } from "../controllers/authController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/pincodes", (req, res) => {
    getPincodes(req, res);
});

router.get("/hospitals", (req, res) => {
    getHospitals(req, res);
});

router.get("/fetchDoctors", (req, res) => {
    getDoctors(req, res);
});

router.post("/register", (req, res) => {
    register(req, res);
});

router.post("/login", (req, res) => {
    login(req, res);
});

router.post("/refresh-token", (req, res) => {
    refreshToken(req, res);
});

router.get("/me", auth, (req, res) => {
    me(req, res);
});

router.post("/logout", auth, (req, res) => {
    logout(req, res);
});

export default router;