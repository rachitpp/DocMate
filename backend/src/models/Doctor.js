import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "doctor",
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        mobile_number: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ["male", "female"]
        },
        hospital: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital"
        }
    },
    {
        timestamps: true,
    }
);

const Doctor = mongoose.model("Doctor", DoctorSchema);
export default Doctor;