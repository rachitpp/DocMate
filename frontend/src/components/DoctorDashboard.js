import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import "../Styles/Dashboard.css";
import { Datepicker, Progress } from "flowbite-react";
import { useEffect, useState } from "react";
import { useStore } from "../store/store";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { logout } from "../store/reducers/userActions";
import { Button, Grid, Sheet, Switch, Typography } from "@mui/joy";
import MuiLink from '@mui/joy/Link';
import PersonIcon from '@mui/icons-material/Person';
import calculateAge from "../utils/calculateAge";

const DoctorDashboard = () => {
    const [patients, setPatients] = useState([
        {
            "name": "Aarav",
            "age": 25,
            "height": 170,
            "weight": 65,
            "gender": "male",
            "date": "2024-04-25"
        },
        {
            "name": "Aisha",
            "age": 22,
            "height": 160,
            "weight": 55,
            "gender": "female",
            "date": "2024-04-25"
        },
        {
            "name": "Aditya",
            "age": 28,
            "height": 175,
            "weight": 70,
            "gender": "male",
            "date": "2024-04-25"
        },
        {
            "name": "Ananya",
            "age": 23,
            "height": 165,
            "weight": 58,
            "gender": "female",
            "date": "2024-04-25"
        },
        {
            "name": "Arjun",
            "age": 30,
            "height": 180,
            "weight": 75,
            "gender": "male",
            "date": "2024-04-25"
        },
        {
            "name": "Avni",
            "age": 26,
            "height": 155,
            "weight": 50,
            "gender": "female",
            "date": "2024-04-25"
        },
        {
            "name": "Amit",
            "age": 29,
            "height": 172,
            "weight": 68,
            "gender": "male",
            "date": "2024-04-25"
        }
    ]
    )
    const [appointmentData, setAppointmentData] = useState([]);
    const [totalPatients, setTotalPatients] = useState();
    const [todayPatient, setTodayPatient] = useState();
    const [totalAppointments, settotalAppointments] = useState();
    const [slot, setSlot] = useState("morning");
    const data = {
        labels: ["Label 1", "Label 2", "Label 3"],
        datasets: [
            {
                data: [30, 50, 20],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
        ],
    };
    const [selectedPatient, setSelectedPatient] = useState({});
    const [state, dispatch] = useStore();
    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };
    const navigate = useNavigate();
    const api = useAxios();
    async function fetchData() {
        const response = await api.get(`${process.env.REACT_APP_API_URL}/doctor/dashboard`, {}, { withCredentials: true });
        if (response.data?.appointments.length > 0 && response.data?.appointments[0][slot].length > 0){
            JSON.stringify(selectedPatient) === JSON.stringify({}) && setSelectedPatient(response.data?.appointments[0][slot][0] || {});
        }
        response.data?.appointments && setAppointmentData(response.data?.appointments);
        setTotalPatients(response.data?.uniquePatientsForDoctor);
        setTodayPatient(response.data?.totalNumberOfAppointmentsToday);
        settotalAppointments(response.data?.totalNumberOfAppointments);
    }
    useEffect(() => {
        fetchData();
    }, []);

    const logoutHandler = async () => {
        api.post(process.env.REACT_APP_API_URL + "/auth/logout", {}, { withCredentials: true, })
            .then(response => {
                dispatch(logout())
                navigate("/")
            })
            .catch(error => {
                alert.error(error.response.data.error)
            });
    }
    async function updateAppointment(appointmentId) {
        api.post(process.env.REACT_APP_API_URL + "/doctor/updateAppointment", { appointmentId }, { withCredentials: true, })
            .then(response => {
                fetchData();
            })
            .catch(error => {
                alert.error(error.response.data.error)
            });
    }
    return (<>
        <Sheet sx={{ width: "100vw", height: "100vh", display: "flex", alignItems: "start", flexDirection: "row", justifyContent: "center", padding: "1rem", overflow: "hidden" }}>
            <Sheet sx={{ width: "300px", height: "100%", display: "flex", alignItems: "start", flexDirection: "column", justifyContent: "start", paddingRight: "0.5rem", paddingLeft: "1rem" }}>
                <Typography level="h1" component="h1">Docmate</Typography>
                <Typography>
                    <Link to={`/${state?.user?.role}/dashboard`}><MuiLink color="white">Dashboard</MuiLink></Link>
                </Typography>
                <Typography>
                    <Typography onClick={() => { logoutHandler() }}><MuiLink color="white">Logout</MuiLink></Typography>
                </Typography>
            </Sheet>
            <Grid container spacing={2} width={"calc(100% - 300px)"} height={"100%"} maxHeight={"100%"}>
                <Grid xs={4} height={"fit-content"}>
                    <Sheet sx={{ padding: "1rem", borderRadius: 'sm', boxShadow: 'md', display: 'flex', flexDirection: 'row', gap: 2 }} variant="outlined">
                        <Sheet>
                            <PersonIcon sx={{ height: "100%", width: "65px" }} />
                        </Sheet>
                        <Sheet>
                            <Typography>Total patients</Typography>
                            <Typography>{totalPatients || 0}</Typography>
                            <Typography>Till today</Typography>
                        </Sheet>
                    </Sheet>
                </Grid>
                <Grid xs={4} height={"fit-content"}>
                    <Sheet sx={{ padding: "1rem", borderRadius: 'sm', boxShadow: 'md', display: 'flex', flexDirection: 'row', gap: 2 }} variant="outlined">
                        <Sheet>
                            <PersonIcon sx={{ height: "100%", width: "65px" }} />
                        </Sheet>
                        <Sheet>
                            <Typography>Today patient</Typography>
                            <Typography>{todayPatient || 0}</Typography>
                            <Typography>{(new Date()).toLocaleDateString("en-IN")}</Typography>
                        </Sheet>
                    </Sheet>
                </Grid>
                <Grid xs={4} height={"fit-content"}>
                    <Sheet sx={{ padding: "1rem", borderRadius: 'sm', boxShadow: 'md', display: 'flex', flexDirection: 'row', gap: 2 }} variant="outlined">
                        <Sheet>
                            <PersonIcon sx={{ height: "100%", width: "65px" }} />
                        </Sheet>
                        <Sheet>
                            <Typography>Total appoinments</Typography>
                            <Typography>{totalAppointments || 0}</Typography>
                            <Typography>Till {(new Date()).toLocaleDateString("en-IN")}</Typography>
                        </Sheet>
                    </Sheet>
                </Grid>
                <Grid container xs={12} sx={{ height: "100%", maxHeight: "100%", scroll: "hidden auto" }}>
                    <Grid xs={6} sx={{ display: "flex", flexDirection: "column" }} spacing={2}>
                        <Sheet sx={{ padding: "1rem", borderRadius: 'sm', boxShadow: 'md', display: 'flex', flexDirection: 'row', gap: 2 }} variant="outlined">
                            <Grid container spacing={2} width={"100%"}>
                                <Grid xs={12}>
                                    <Typography level="h3" component="h3">Morning appointments</Typography>
                                </Grid>
                                <Grid sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} xs={2}>
                                </Grid>
                                <Grid xs={6}>
                                    <Typography>Patient Name</Typography>
                                </Grid>
                                <Grid sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} xs={4}>
                                    <Typography>Status</Typography>
                                </Grid>
                                {appointmentData[0]?.morning.map((x, i) => <>
                                    <Grid sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} xs={2}>
                                        <PersonIcon />
                                    </Grid>
                                    <Grid xs={6}>
                                        <Typography sx={{ cursor: "pointer" }} onClick={() => { setSelectedPatient(x?.patient) }}>{x?.patient?.name}</Typography>
                                    </Grid>
                                    <Grid sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} xs={4}>
                                        {i === 0 ? <><Button onClick={(e) => { updateAppointment(x?.appointmentId); }}>Done</Button></> : <Typography>{i + 1}</Typography>}
                                    </Grid>
                                </>)}
                            </Grid>
                        </Sheet>
                        <Sheet sx={{ padding: "1rem", borderRadius: 'sm', boxShadow: 'md', display: 'flex', flexDirection: 'row', gap: 2, marginTop: "1rem" }} variant="outlined">
                            <Grid container spacing={2} width={"100%"}>
                                <Grid xs={12}>
                                    <Typography level="h3" component="h3">Evening appointments</Typography>
                                </Grid>
                                <Grid sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} xs={2}>
                                </Grid>
                                <Grid xs={6}>
                                    <Typography>Patient Name</Typography>
                                </Grid>
                                <Grid sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} xs={4}>
                                    <Typography>Status</Typography>
                                </Grid>
                                {appointmentData[0]?.evening.map((x, i) => <>
                                    <Grid sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} xs={2}>
                                        <PersonIcon />
                                    </Grid>
                                    <Grid xs={6}>
                                        <Typography sx={{ cursor: "pointer" }} onClick={() => { setSelectedPatient(x?.patient) }}>{x?.patient?.name}</Typography>
                                    </Grid>
                                    <Grid sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} xs={4}>
                                        {i === 0 ? <><Button onClick={(e) => { updateAppointment(x?.appointmentId); }}>Done</Button></> : <Typography>{i + 1}</Typography>}
                                    </Grid>
                                </>)}
                            </Grid>
                        </Sheet>
                    </Grid>
                    <Grid xs={6} sx={{ display: "flex", flexDirection: "column" }} spacing={2}>
                        <Sheet sx={{ padding: "1rem", borderRadius: 'sm', boxShadow: 'md', display: 'flex', flexDirection: 'column', gap: 2 }} variant="outlined">
                            <Grid container width={"100%"} sx={{ justifyContent: "space-between" }}>
                                <Typography level="h3" component="h3">Patient Details</Typography>
                                {/* <Switch
                                    checked={slot === "evening"}
                                    onChange={(event) => setSlot(slot === "evening" ? "morning" : "evening") }
                                    color={'neutral'}
                                    variant={'outlined'}
                                    endDecorator={slot === "evening" ? "Evening Slot" : "Morning Slot"}
                                    slotProps={{
                                        endDecorator: {
                                            sx: {
                                                minWidth: 24,
                                            },
                                        },
                                    }}
                                /> */}
                            </Grid>
                            <Typography>Name: {selectedPatient?.name || "Select a patient to view details"}</Typography>
                            <Typography>Age: {calculateAge(selectedPatient?.dob, new Date())}</Typography>
                            <Typography>Height: {selectedPatient?.height || "Select a patient to view details"}</Typography>
                            <Typography>Weight: {selectedPatient?.weight || "Select a patient to view details"}</Typography>
                            <Typography>Gender: {selectedPatient?.gender || "Select a patient to view details"}</Typography>
                            <Typography>Date of Birth: {selectedPatient?.dob ? (new Date(selectedPatient?.dob)).toLocaleDateString("en-IN") : "Select a patient to view details"}</Typography>
                        </Sheet>
                    </Grid>
                </Grid>
            </Grid>
        </Sheet>
    </>);
};

export default DoctorDashboard;
