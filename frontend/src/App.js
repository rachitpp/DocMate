import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Dashboard from './components/Dashboard';
import Contact from './components/Contact';
import Login from './components/Login';
import Footer from './components/Footer';
import Register from './components/Register';
import AppointmentForm from "./components/AppointmentForm";
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './utils/protectedRoutes';
import OnlyUnauthRoute from './utils/onlyUnauthRoutes';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useStore } from './store/store';
import { setAuth } from './store/reducers/userActions';
import useAxios from './utils/useAxios';
import { setUser, logout } from './store/reducers/userActions';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import { Sheet, Typography, useColorScheme } from '@mui/joy';
import QRCodePage from './components/QRCodePage';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const App = () => {
    const { mode, setMode } = useColorScheme();
    const [state, dispatch] = useStore();
    const api = useAxios();
    useEffect(() => {
        async function checkAuth() {
            setMode("dark");
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh-token`, {}, { withCredentials: true });
                if (!response.data.error && response.data.accessToken) {
                    dispatch(setAuth(response.data.accessToken, true));
                    const res = await api.get("/auth/me");
                    if (!res.data.error) {
                        dispatch(setUser({ ...res.data.user }));
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

    return (
        <BrowserRouter>
            <ToastContainer />
            <Routes>
                <Route path="/appointment/:id" element={(<><QRCodePage /></>)} />
                <Route element={<ProtectedRoute redirectTo="/login" />}>
                    <Route path="/dashboard" element={(<><Dashboard /></>)} />
                </Route>
                <Route element={<ProtectedRoute redirectTo="/login" />}>
                    <Route path="/doctor/dashboard" element={(<><DoctorDashboard /></>)} />
                </Route>
                <Route element={<ProtectedRoute redirectTo="/login" />}>
                    <Route path="/patient/dashboard" element={(<><PatientDashboard /></>)} />
                </Route>
                <Route element={<ProtectedRoute redirectTo="/login" />}>
                    <Route path="/appointment" element={<><Navbar /><AppointmentForm /><Footer /></>} />
                </Route>
                <Route path="/about" element={(<><Navbar /><About /><Footer /></>)} />
                <Route path="/contact" element={(<><Navbar /><Contact /><Footer /></>)} />
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route element={<OnlyUnauthRoute redirectTo="/dashboard" />}>
                    <Route path="/login" element={<Login />} />
                </Route>
                <Route element={<OnlyUnauthRoute redirectTo="/dashboard" />}>
                    <Route path="/register" element={<Register />} />
                </Route>
            </Routes>
            <>
                <Sheet sx={{ position: "absolute", right: "20px", bottom: "20px", padding: "20px 40px", borderRadius: "40px" }}>
                    <Link to="https://google.com" sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                        <Typography>
                            Docmate AI
                        </Typography>
                    </Link>
                </Sheet>
            </>
        </BrowserRouter>
    );
};

export default App;
