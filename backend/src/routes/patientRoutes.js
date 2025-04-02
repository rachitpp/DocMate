import { Router } from "express";
import { changePincode, deleteAppointment, getAppointment, getDashboard, postAppointment } from "../controllers/patientController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/dashboard", auth, (req, res) => {
    getDashboard(req, res);
});

router.post("/appointment", auth, (req, res) => {
    postAppointment(req, res);
});

router.delete("/appointment/:id", auth, (req, res) => {
    deleteAppointment(req, res);
});

router.get("/appointment/:id", (req, res) => {
    getAppointment(req, res);
});

router.patch("/pincode", auth, (req, res) => {
    changePincode(req, res);
});

export default router;