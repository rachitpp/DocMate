import axios from "axios";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { MONGODB_URI, ORIGIN, ORIGIN2, PORT } from "./constants.js";
import authRoutes from "./routes/authRoutes.js"
import patientRoutes from "./routes/patientRoutes.js"
import doctorRoutes from "./routes/doctorRoutes.js"

const mongooseOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
};
mongoose.connect(MONGODB_URI, mongooseOptions).then(
    () => {
        console.log("Connected to MongoDB");
    },
    (err) => {
        console.log("Error connecting to MongoDB: ", err);
    }
);

mongoose.connection.on("error", (err) => {
    console.log(err);
});

const app = express();
const corsOptions = {
    origin: [ORIGIN, ORIGIN2],
    credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan(function (tokens, req, res) {
    if (tokens.method(req, res) !== "OPTIONS") {
        return [
            chalk.bgGreen.bold(tokens.method(req, res)),
            chalk.bold(tokens.status(req, res)),
            chalk.green.bold(`"${tokens.url(req, res)}"`),
            chalk.yellow("in " + tokens['response-time'](req, res) + ' ms'),
            chalk.yellow('from ' + tokens.referrer(req, res))
        ].join(' ');
    }
})
);

app.get("/", (req, res) => {
    console.log("server started successfully")
    res.send("welcome to docmate");
});
app.use("/api/auth", cors(corsOptions), authRoutes);
app.use("/api/patient", cors(corsOptions), patientRoutes);
app.use("/api/doctor", cors(corsOptions), doctorRoutes);

console.log(`Listening on port ${PORT}`);

app.listen(PORT, () => {
    axios.get(`http://localhost:${PORT}/`)
});