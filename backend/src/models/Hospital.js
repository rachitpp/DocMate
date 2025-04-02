import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema(
    {
        hospitalName: {
            type: String,
            required: true
        },
        hospitalAddress: {
            type: String,
            required: true
        },
        lat: {
            type: String,
            required: true
        },
        lng: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const Hospital = mongoose.model("Hospital", HospitalSchema);
export default Hospital;