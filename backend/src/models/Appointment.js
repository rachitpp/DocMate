import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },
        appointmentDate: {
            type: Date,
            required: true
        },
        appointmentSlot: {
            type: String,
            enum: ["morning", "evening"],
            default: "morning",
            required: true
        },
        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "done"],
            default: "pending"
        }
    },
    {
        timestamps: true,
    }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment;