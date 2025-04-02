import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { Sheet, Typography } from "@mui/joy";
import { useStore } from "../store/store";
import MuiLink from '@mui/joy/Link';
import { Link } from "react-router-dom";
import axios from "axios";
import useAxios from "../utils/useAxios";
import { logout } from "../store/reducers/userActions";

const QRCodePage = () => {
    const [state, dispatch] = useStore();
    const [appointments, setAppointments] = useState({});
    const api = useAxios();
    const navigate = useNavigate();
    const { id } = useParams();
    async function fetchData() {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/patient/appointment/${id}`);
        if (!response.error) {
            setAppointments(response.data);
        }
    }

    const logoutHandler = async () => {
        api.post(process.env.REACT_APP_API_URL + "/auth/logout", {}, { withCredentials: true, })
            .then(response => {
                dispatch(logout());
                navigate("/");
            })
            .catch(error => {
                alert.error(error.response.data.error)
            });
    }

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div>
            <main>
                <Sheet sx={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "center", padding: "1rem" }}>
                    <Sheet sx={{ width: "300px", height: "100%", display: "flex", alignItems: "start", flexDirection: "column", justifyContent: "start", paddingRight: "0.5rem", paddingLeft: "1rem" }}>
                        <Typography level="h1" component="h1">Docmate</Typography>
                        <Typography>
                            <Link to={`/${state?.user?.role}/dashboard`}><MuiLink color="white">Dashboard</MuiLink></Link>
                        </Typography>
                        {state?.authenticated && <Typography>
                            <Typography onClick={logoutHandler}><MuiLink color="white">Logout</MuiLink></Typography>
                        </Typography>}
                    </Sheet>
                    <Sheet sx={{ width: "calc(100% - 300px)", height: "100%", paddingLeft: "0.5rem" }}>
                        <Typography level="h3" component="h3">Your appointment</Typography>
                        <Sheet sx={{ margin: "auto", width: "fit-content", maxWidth: "400px" }}>
                            <Sheet sx={{ margin: "auto", width: "fit-content" }}>
                                {JSON.stringify(appointments) !== JSON.stringify({}) && <QRCode value={`${process.env.REACT_APP_CLIENT_URL}/qr-code/${id}`} size={256} viewBox={"0 0 256 256"} fgColor="red" />}
                            </Sheet>
                            {JSON.stringify(appointments) !== JSON.stringify({}) && <>
                                <Typography marginTop={"0.75rem"} level="h4" component="h4">Patient name: {appointments?.patientId?.name}</Typography>
                                <Typography marginBottom={"0.75rem"} level="h4" component="h4">Position in queue: {appointments?.positionInQueue}</Typography>
                                <Typography level="h4" component="h4">Phone no.: {appointments?.patientId?.mobile_number}</Typography>
                                <Typography level="h4" component="h4">Gender: {appointments?.patientId?.gender}</Typography>
                                <Typography level="h4" component="h4">Doctor name: {appointments?.doctorId?.name}</Typography>
                                <Typography level="h4" component="h4">Doctor email: {appointments?.doctorId?.email}</Typography>
                                <Typography level="h4" component="h4">Hospital: {appointments?.hospitalId?.hospitalName}</Typography>
                                <Typography level="h4" component="h4">Hospital Address: {appointments?.hospitalId?.hospitalName}, {appointments?.hospitalId?.hospitalAddress}</Typography>
                                <Typography level="h4" component="h4">Hospital Pincode: {appointments?.hospitalId?.pincode}</Typography>
                                <MuiLink level="h4" component="h4"><Link to={`https://www.google.com/maps?q=${appointments?.hospitalId?.lat},${appointments?.hospitalId?.lng}`}>Get directions on Google Maps</Link></MuiLink>
                            </>}
                        </Sheet>
                    </Sheet>
                </Sheet>
            </main>
        </div>
    );
};

export default QRCodePage;
