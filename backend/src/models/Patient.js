import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "patient",
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
        pincode: {
            type: Number
        },
        height: {
            type: Number
        },
        weight: {
            type: Number
        },
        dob: {
            type: Date
        }
    },
    {
        timestamps: true,
    }
);

const Patient = mongoose.model("Patient", PatientSchema);
export default Patient;