import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import "../Styles/Dashboard.css";
import { Datepicker, Progress } from "flowbite-react";
import { useEffect } from "react";
import { useStore } from "../store/store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout, setAuth, setUser } from "../store/reducers/userActions";
import useAxios from "../utils/useAxios";
import { Sheet } from "@mui/joy";

const Dashboard = () => {
    const [state, dispatch] = useStore();
    const api = useAxios();
    const navigate = useNavigate();
    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh-token`, {}, { withCredentials: true });
                if (!response.data.error && response.data.accessToken) {
                    dispatch(setAuth(response.data.accessToken, true));
                    const res = await api.get("/auth/me");
                    if (!res.data.error) {
                        dispatch(setUser({ ...res.data.user }));
                        res.data.user?.role === "doctor" ? navigate("/doctor/dashboard") : navigate("/patient/dashboard");
                    }
                } else {
                    console.log(response.data.error);
                    dispatch(logout());
                }
            } catch (err) {
                console.log(err);
            }
        }
        checkAuth();
    }, []);
    return (<>
        <Sheet height="100vh" width="100vw"></Sheet>
    </>);
};

export default Dashboard;
