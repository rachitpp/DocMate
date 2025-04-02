import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Hospital from "../models/Hospital.js";

export const getDashboard = async (req, res) => {
    const u = req.user;
    const User = req.user.type === 'doctor' ? Doctor : Patient;
    const user = await User.findById(u._id).exec();
    const objUser = user.toObject();
    const doctors = await Doctor.find({}).select("name _id").exec();
    const pincodes = await Hospital.distinct("pincode").exec();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const appointments = await Appointment.find({ patientId: user._id, appointmentDate: { $gte: today } }).sort({}).populate({ path: "doctorId", select: "name gender -_id" }).populate({ path: "hospitalId", select: "hospitalName pincode -_id" }).exec();
    appointments.sort((a, b) => {
        const dateA = new Date(a.appointmentDate).getTime();
        const dateB = new Date(b.appointmentDate).getTime();
        if (dateA > Date.now() && dateB <= Date.now()) {
            return -1;
        }
        else if (dateB > Date.now() && dateA <= Date.now()) {
            return 1;
        }
        else {
            return dateA - dateB;
        }
    });
    const previousAppointments = await Appointment.find({ patientId: user._id, appointmentDate: { $lt: today } }).sort({}).populate({ path: "doctorId", select: "name gender -_id" }).populate({ path: "hospitalId", select: "hospitalName pincode -_id" }).exec();
    previousAppointments.sort((a, b) => {
        const dateA = new Date(a.appointmentDate).getTime();
        const dateB = new Date(b.appointmentDate).getTime();
        if (dateA > Date.now() && dateB <= Date.now()) {
            return -1;
        }
        else if (dateB > Date.now() && dateA <= Date.now()) {
            return 1;
        }
        else {
            return dateA - dateB;
        }
    });
    return res.json({ doctorsList: doctors, appointments, pincodes, previousAppointments });
}

export const postAppointment = async (req, res) => {
    try {
        const { date, slot, doctorId, hospitalId } = req.body;
        const u = req.user;
        const User = req.user.type === 'doctor' ? Doctor : Patient;
        const user = await User.findById(u._id).exec();
        const newAppointment = new Appointment({
            doctorId: doctorId,
            patientId: user._id,
            hospitalId: new mongoose.Types.ObjectId(hospitalId),
            appointmentDate: new Date(date),
            appointmentSlot: slot
        });
        await newAppointment.save();
        return res.json({ error: false, message: "Appoinment booked" });
    } catch (e) {
        console.log(e);
        res.send({ error: true, msg: e.message });
    }
}

export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params
        const u = req.user;
        const User = req.user.type === 'doctor' ? Doctor : Patient;
        const user = await User.findById(u._id).exec();
        const appointment = await Appointment.deleteOne({ _id: id, patientId: user._id });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found", error: true });
        }
        res.status(200).json({ message: "Appointment cancelled" });
    } catch (error) {
        console.error("Delete appointment error:", error);
        res.status(500).json({ message: "An error occurred while deleting the appointment", error: true });
    }
}

export const getAppointment = async (req, res) => {
    const { id } = req.params;
    const appointment = await Appointment.findOne({ _id: id }).populate({ path: "hospitalId" }).populate({ path: "doctorId" }).populate({ path: "patientId" }).exec();
    const today = new Date(appointment?.appointmentDate);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const appointments = await Appointment.find({ doctorId: appointment?.doctorId, appointmentDate: { $gte: today, $lt: tomorrow }, appointmentSlot: appointment?.appointmentSlot, status: "pending" }).sort({ createdAt: 1 }).exec();
    console.log(appointments)
    const index = appointments.findIndex(x => x?._id.toString() === appointment?._id.toString());
    return res.send({ ...appointment.toObject(), positionInQueue: index + 1 });
}

export const changePincode = async (req, res) => {
    const { newPincode } = req.body
    const u = req.user;
    console.log(u._id)
    const patient = await Patient.findOneAndUpdate({ _id: u?._id }, { pincode: newPincode });
    res.send({ status: "ok" });
}