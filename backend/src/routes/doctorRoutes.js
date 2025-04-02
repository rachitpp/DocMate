import { Router } from "express";
import { getDashboard, updateAppointment } from "../controllers/doctorController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/dashboard", auth, (req, res) => {
    getDashboard(req, res);
});

router.post("/updateAppointment", auth, (req, res) => {
    updateAppointment(req, res);
});

export default router;