import "../Styles/Dashboard.css";
import { useEffect, useState } from "react";
import { useStore } from "../store/store";
import { useNavigate } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { toast } from 'react-toastify';
import { Button, FormControl, FormLabel, Grid, IconButton, Input, List, ListDivider, ListItem, Option, Select, Sheet, ToggleButtonGroup, Typography } from "@mui/joy";
import { Link } from 'react-router-dom';
import MuiLink from '@mui/joy/Link';
import { Delete } from "@mui/icons-material";
import { logout, setUser } from "../store/reducers/userActions";

const PatientDashboard = () => {
    const [state, dispatch] = useStore();
    const [date, setDate] = useState(Date.now());
    const [selectedSlot, selSelectedSlot] = useState('morning');
    const [doctorsList, setDoctorsList] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState({ name: "loading", _id: "loading" });
    const [selectedHospitalId, setSelectedHospitalId] = useState(undefined);
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [previousAppointments, setPreviousAppointments] = useState([]);
    const [hospitalList, setHospitalList] = useState([]);
    const [pincodes, setPincodes] = useState([]);
    const [selectedPincode, setSelectedPincode] = useState(state?.user?.pincode || undefined);
    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };
    const handleOptionChange = (event) => {
        selSelectedSlot(event.target.value);
    };
    const navigate = useNavigate();
    const api = useAxios();

    async function fetchData() {
        const response = await api.get(`${process.env.REACT_APP_API_URL}/patient/dashboard`, {}, { withCredentials: true });
        const hospitals = await api.get(`${process.env.REACT_APP_API_URL}/auth/hospitals?pincode=${state?.user?.pincode}`);
        if (!response.error) {
            setAppointments(response.data?.appointments);
            setPreviousAppointments(response?.data?.previousAppointments)
            setPincodes(response.data?.pincodes);
        }
        setHospitalList(hospitals.data);
    }

    async function fetchDoctors() {
        const response = await api.get(`${process.env.REACT_APP_API_URL}/auth/fetchDoctors?hospitalId=${selectedHospitalId}`);
        setDoctorsList(response.data);
    }

    useEffect(() => {
        fetchDoctors();
    }, [selectedHospitalId]);

    useEffect(() => {
        fetchData();
        fetchDoctors();
    }, [state?.user]);

    useEffect(() => {
        fetchData();
        fetchDoctors();
    }, []);

    async function createAppointment(e) {
        e.preventDefault();
        const response = await api.post(`${process.env.REACT_APP_API_URL}/patient/appointment`, { date, slot: selectedSlot, doctorId: selectedDoctorId, hospitalId: selectedHospitalId }, { withCredentials: true });
        if (!response.data.error) {
            toast.success(response?.data?.message, { position: toast.POSITION.TOP_CENTER });
            fetchData();
        }
    }

    async function deleteAppointment(e, appointmentId) {
        e.preventDefault(e);
        const response = await api.delete(`${process.env.REACT_APP_API_URL}/patient/appointment/${appointmentId}`, {}, { withCredentials: true });
        if (!response.data.error) {
            toast.success(response?.data?.message, { position: toast.POSITION.TOP_CENTER });
            fetchData();
        }
    }

    async function updateUserState() {
        const res = await api.get("/auth/me");
        if (!res.data.error) {
            dispatch(setUser({ ...res.data.user }));
        }
    }

    async function changePincode(e) {
        e.preventDefault();
        const response = await api.patch(`${process.env.REACT_APP_API_URL}/patient/pincode`, { newPincode: selectedPincode }, { withCredentials: true });
        await fetchData();
        await fetchDoctors();
        toast.success("Pincode changed", { position: toast.POSITION.TOP_CENTER });
        updateUserState();
    }

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

    return (
        <div>
            <main>
                <Sheet sx={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "center", padding: "1rem" }}>
                    <Sheet sx={{ width: "300px", height: "100%", display: "flex", alignItems: "start", flexDirection: "column", justifyContent: "start", paddingRight: "0.5rem", paddingLeft: "1rem" }}>
                        <Typography level="h1" component="h1">Docmate</Typography>
                        <Typography>
                            <Link to={`/${state?.user?.role}/dashboard`}><MuiLink color="white">Dashboard</MuiLink></Link>
                        </Typography>
                        <Typography>
                            <Typography onClick={() => { logoutHandler() }}><MuiLink color="white">Logout</MuiLink></Typography>
                        </Typography>
                    </Sheet>
                    {/* <Grid container spacing={2} width={"calc(100% - 300px)"}>
                        <Grid xs={6}>
                            <Sheet sx={{ padding: "1rem", borderRadius: 'sm', boxShadow: 'md', display: 'flex', flexDirection: 'column', gap: 2 }} variant="outlined">
                                <Typography level="h3" component="h3">Book Appointment</Typography>
                                <FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <Input
                                        value={state?.user?.name}
                                        type="text"
                                        placeholder="name"
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Date</FormLabel>
                                    <Input
                                        type="date"
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Choose a hospital</FormLabel>
                                    <Select placeholder="Choose your hospital" defaultValue={hospitalList.length > 0 ? hospitalList[0] : "fetching hospitals"} onChange={(e, newValue) => { setSelectedHospitalId(newValue); }}>
                                        {hospitalList.map(x => (<Option value={x._id}>{x?.hospitalName}</Option>))}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Choose a doctor</FormLabel>
                                    <Select placeholder="Choose your doctor" defaultValue={doctorsList.length > 0 ? doctorsList[0] : "fetching doctors"} onChange={(e, newValue) => { setSelectedDoctorId(newValue) }}>
                                        {doctorsList.map(x => (<Option value={x._id}>{x?.name}</Option>))}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <Typography sx={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
                                        <Typography sx={{ marginRight: "0.5em" }}>Slot: </Typography>
                                        <ToggleButtonGroup
                                            value={selectedSlot}
                                            onChange={(event, newValue) => { selSelectedSlot(newValue) }}
                                        >
                                            <Button value="morning">Morning slot</Button>
                                            <Button value="evening">Evening slot</Button>
                                        </ToggleButtonGroup>
                                    </Typography>
                                </FormControl>
                                <Button sx={{ mt: 1 }} onClick={e => createAppointment(e)}>Register</Button>
                            </Sheet>
                        </Grid>
                        <Grid xs={6}>
                            <Sheet sx={{ padding: "1rem", borderRadius: 'sm', boxShadow: 'md', display: 'flex', flexDirection: 'column', gap: 2 }} variant="outlined">
                                <Typography level="h3" component="h3">Your appointments</Typography>
                                <List variant="outlined" sx={{ borderRadius: "sm" }}>
                                    {appointments && appointments.length > 0 && <>
                                        {appointments.map(x => <>
                                            <ListItem
                                                endAction={
                                                    <IconButton aria-label="Delete" size="sm" color="danger" onClick={(e) => { deleteAppointment(e, x?._id) }}>
                                                        <Delete />
                                                    </IconButton>
                                                }>
                                                <Link to={`/appointment/${x?._id}`}>
                                                    <Typography>
                                                        doctor: {x?.doctorId?.name}, {x?.doctorId?.gender}
                                                    </Typography>
                                                    <Typography>
                                                        date: {new Date(x?.appointmentDate).toLocaleDateString("en-GB")}
                                                    </Typography>
                                                    <Typography>
                                                        slot: {x?.appointmentSlot}
                                                    </Typography>
                                                    <Typography>
                                                        hospital name: {x?.hospitalId?.hospitalName}, {x?.hospitalId?.pincode}
                                                    </Typography>
                                                    <Typography>
                                                        booked on: {(new Date(x?.createdAt)).toLocaleDateString()}
                                                    </Typography>
                                                </Link>
                                            </ListItem>
                                            <ListDivider inset="gutter" />
                                        </>)}
                                    </>}
                                </List>
                            </Sheet>
                        </Grid>
                        <Grid xs={6}>
                            <Sheet sx={{ padding: "1rem", borderRadius: 'sm', boxShadow: 'md', display: 'flex', flexDirection: 'column', gap: 2 }} variant="outlined">
                                <Typography level="h3" component="h3">Change Pincode</Typography>
                                <Select placeholder="Choose your pincode" defaultValue={state?.user?.pincode} onChange={(e, newValue) => { setSelectedPincode(newValue) }}>
                                    {pincodes.map(x => (<Option value={x}>{x}</Option>))}
                                </Select>
                                <Button sx={{ mt: 1 }} onClick={e => changePincode(e)}>Change pincode</Button>
                            </Sheet>
                        </Grid>
                    </Grid> */}
                    <Grid container spacing={2} width={"calc(100% - 300px)"} height={"100vh"}>
                        <Grid xs={6} sx={{ display: "flex", flexDirection: "column" }} spacing={2}>
                            <Sheet sx={{ padding: "1rem", borderRadius: 'sm', boxShadow: 'md', display: 'flex', flexDirection: 'column', gap: 2 }} variant="outlined">
                                <Typography level="h3" component="h3">Book Appointment</Typography>
                                <FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <Input
                                        value={state?.user?.name}
                                        type="text"
                                        placeholder="name"
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Date</FormLabel>
                                    <Input
                                        type="date"
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Choose a hospital</FormLabel>
                                    <Select placeholder="Choose your hospital" defaultValue={hospitalList.length > 0 ? hospitalList[0] : "fetching hospitals"} onChange={(e, newValue) => { setSelectedHospitalId(newValue); }}>
                                        {hospitalList.map(x => (<Option value={x._id}>{x?.hospitalName}</Option>))}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Choose a doctor</FormLabel>
                                    <Select placeholder="Choose your doctor" defaultValue={doctorsList.length > 0 ? doctorsList[0] : "fetching doctors"} onChange={(e, newValue) => { setSelectedDoctorId(newValue) }}>
                                        {doctorsList.map(x => (<Option value={x._id}>{x?.name}</Option>))}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <Typography sx={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
                                        <Typography sx={{ marginRight: "0.5em" }}>Slot: </Typography>
                                        <ToggleButtonGroup
                                            value={selectedSlot}
                                            onChange={(event, newValue) => { selSelectedSlot(newValue) }}
                                        >
                                            <Button value="morning">Morning slot</Button>
                                            <Button value="evening">Evening slot</Button>
                                        </ToggleButtonGroup>
                                    </Typography>
                                </FormControl>
                                <Button sx={{ mt: 1 }} onClick={e => createAppointment(e)}>Register</Button>
                            </Sheet>
                            <Sheet sx={{ padding: "1rem", borderRadius: 'sm', boxShadow: 'md', display: 'flex', flexDirection: 'column', gap: 2, marginTop: "1rem" }} variant="outlined">
                                <Typography level="h3" component="h3">Change Pincode</Typography>
                                <Select placeholder="Choose your pincode" defaultValue={state?.user?.pincode} onChange={(e, newValue) => { setSelectedPincode(newValue) }}>
                                    {pincodes.map(x => (<Option value={x}>{x}</Option>))}
                                </Select>
                                <Button sx={{ mt: 1 }} onClick={e => changePincode(e)}>Change pincode</Button>
                            </Sheet>
                        </Grid>
                        <Grid xs={6} sx={{ display: "flex", flexDirection: "column" }}>
                            <Sheet sx={{ padding: "1rem", borderRadius: 'sm', boxShadow: 'md', display: 'flex', flexDirection: 'column', gap: 2 }} variant="outlined">
                                <Typography level="h3" component="h3">Upcoming appointments</Typography>
                                <List variant="outlined" sx={{ borderRadius: "sm" }}>
                                    {appointments && appointments.length > 0 && <>
                                        {appointments.map(x => <>
                                            <ListItem
                                                endAction={
                                                    <IconButton aria-label="Delete" size="sm" color="danger" onClick={(e) => { deleteAppointment(e, x?._id) }}>
                                                        <Delete />
                                                    </IconButton>
                                                }>
                                                <Link to={`/appointment/${x?._id}`}>
                                                    <Typography>
                                                        doctor: {x?.doctorId?.name}, {x?.doctorId?.gender}
                                                    </Typography>
                                                    <Typography>
                                                        date: {new Date(x?.appointmentDate).toLocaleDateString("en-GB")}
                                                    </Typography>
                                                    <Typography>
                                                        slot: {x?.appointmentSlot}
                                                    </Typography>
                                                    <Typography>
                                                        hospital name: {x?.hospitalId?.hospitalName}, {x?.hospitalId?.pincode}
                                                    </Typography>
                                                    <Typography>
                                                        booked on: {(new Date(x?.createdAt)).toLocaleDateString()}
                                                    </Typography>
                                                </Link>
                                            </ListItem>
                                            <ListDivider inset="gutter" />
                                        </>)}
                                    </>}
                                </List>
                            </Sheet>
                            <Sheet sx={{ padding: "1rem", borderRadius: 'sm', boxShadow: 'md', display: 'flex', flexDirection: 'column', gap: 2, marginTop: "1rem" }} variant="outlined">
                                <Typography level="h3" component="h3">Previous appointments</Typography>
                                <List variant="outlined" sx={{ borderRadius: "sm" }}>
                                    {previousAppointments && previousAppointments.length > 0 && <>
                                        {previousAppointments.map(x => <>
                                            <ListItem>
                                                <Link to={`/appointment/${x?._id}`}>
                                                    <Typography>
                                                        doctor: {x?.doctorId?.name}, {x?.doctorId?.gender}
                                                    </Typography>
                                                    <Typography>
                                                        date: {new Date(x?.appointmentDate).toLocaleDateString("en-GB")}
                                                    </Typography>
                                                    <Typography>
                                                        slot: {x?.appointmentSlot}
                                                    </Typography>
                                                    <Typography>
                                                        hospital name: {x?.hospitalId?.hospitalName}, {x?.hospitalId?.pincode}
                                                    </Typography>
                                                    <Typography>
                                                        booked on: {(new Date(x?.createdAt)).toLocaleDateString()}
                                                    </Typography>
                                                </Link>
                                            </ListItem>
                                            <ListDivider inset="gutter" />
                                        </>)}
                                    </>}
                                </List>
                            </Sheet>
                        </Grid>
                    </Grid>
                </Sheet>
            </main>
        </div>
    );
};

export default PatientDashboard;
