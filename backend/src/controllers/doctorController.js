import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

export const getDashboard = async (req, res) => {
    const u = req.user;
    const User = req.user.type === 'doctor' ? Doctor : Patient;
    const user = await User.findById(u._id).exec();
    const objUser = user.toObject();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const appointments = await Appointment.aggregate([
        {
            $match: {
                doctorId: user._id,
                status: "pending",
                appointmentDate: { $gte: today, $lt: tomorrow }
            }
        },
        {
            $group: {
                _id: {
                    doctorId: "$doctorId",
                    appointmentDate: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$appointmentDate"
                        }
                    }
                },
                morning: {
                    $addToSet: {
                        appointmentId: "$_id",
                        patientId: {
                            $cond: [
                                { $eq: ["$appointmentSlot", "morning"] },
                                "$patientId",
                                null
                            ]
                        }
                    }
                },
                evening: {
                    $addToSet: {
                        appointmentId: "$_id",
                        patientId: {
                            $cond: [
                                { $eq: ["$appointmentSlot", "evening"] },
                                "$patientId",
                                null
                            ]
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                doctorId: "$_id.doctorId",
                date: "$_id.appointmentDate",
                morning: {
                    $filter: {
                        input: "$morning",
                        as: "m",
                        cond: { $ne: ["$$m.patientId", null] }
                    }
                },
                evening: {
                    $filter: {
                        input: "$evening",
                        as: "e",
                        cond: { $ne: ["$$e.patientId", null] }
                    }
                }
            }
        },
        {
            $lookup: {
                from: "patients",
                localField: "morning.patientId",
                foreignField: "_id",
                as: "morningPatients"
            }
        },
        {
            $lookup: {
                from: "patients",
                localField: "evening.patientId",
                foreignField: "_id",
                as: "eveningPatients"
            }
        },
        {
            $project: {
                doctorId: 1,
                date: 1,
                morning: {
                    $map: {
                        input: "$morning",
                        as: "m",
                        in: {
                            appointmentId: "$$m.appointmentId",
                            patient: {
                                $arrayElemAt: ["$morningPatients", { $indexOfArray: ["$morning.patientId", "$$m.patientId"] }]
                            }
                        }
                    }
                },
                evening: {
                    $map: {
                        input: "$evening",
                        as: "e",
                        in: {
                            appointmentId: "$$e.appointmentId",
                            patient: {
                                $arrayElemAt: ["$eveningPatients", { $indexOfArray: ["$evening.patientId", "$$e.patientId"] }]
                            }
                        }
                    }
                }
            }
        }
    ]);    

    const sortedAppointments = appointments.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });
    const totalNumberOfAppointments = await Appointment.countDocuments({ doctorId: u?._id }).exec();
    const totalNumberOfAppointmentsToday = await Appointment.countDocuments({ doctorId: u?._id, appointmentDate: { $gte: today, $lt: tomorrow } }).exec();
    const uniquePatientsForDoctor = (await Appointment.find({ doctorId: u?._id }).distinct("patientId").exec()).length;
    res.json({ appointments: sortedAppointments, totalNumberOfAppointments, totalNumberOfAppointmentsToday, uniquePatientsForDoctor });
}

export const updateAppointment = async (req, res) => {
    const { appointmentId } = req.body;
    console.log({appointmentId})
    let appoinment = await Appointment.findOneAndUpdate({ _id: appointmentId }, { status: "done" }).exec();
    return res.json({ status: "done" })
}