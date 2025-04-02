import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useStore } from '../store/store';
import { setUser, setAuth } from '../store/reducers/userActions';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import MuiLink from '@mui/joy/Link';
import { Link } from 'react-router-dom';
import { ToggleButtonGroup } from '@mui/joy';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isDoctor, setIsDoctor] = useState(true);
    const [state, dispatch] = useStore();
    const handleSubmit = async (e) => {
        try {
            if (!email || !password) {
                return toast.error("Email and password required", { position: toast.POSITION.TOP_CENTER });
            }
            e.preventDefault();
            const response = await axios.post(process.env.REACT_APP_API_URL + "/auth/login", {
                email, password, role: isDoctor ? "doctor" : "patient"
            }, { withCredentials: true });
            if (!response.data.error) {
                dispatch(setUser(response.data.user));
                dispatch(setAuth(response.data.accessToken, true));
                navigate("/dashboard");
                toast.success('Welcome to DocMate', { position: toast.POSITION.TOP_CENTER });
            } else {
                toast.error(response.data.message, { position: toast.POSITION.TOP_CENTER });
            }
        } catch (error) {
            console.log("error")
            toast.error("An error occoured", { position: toast.POSITION.TOP_CENTER });
        }
    };

    const handleLoginType = (isDoctorLogin) => {
        setIsDoctor(isDoctorLogin);
    };

    useEffect(() => {
        if (state.authenticated) {
            navigate(`/${state?.user?.role}/dashboard`);
            toast.success('Welcome to DocMate', {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }, []);

    return (
        <>
            <main>
                <Sheet sx={{
                    width: "100vw", height: "100vh", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center"
                }}>
                    <CssBaseline />
                    <Sheet
                        sx={{
                            width: 300,
                            mx: 'auto',
                            my: 4,
                            py: 3,
                            px: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            borderRadius: 'sm',
                            boxShadow: 'md',
                        }}
                        variant="outlined"
                    >
                        <div>
                            <Typography level="h4" component="h1">
                                <b>Welcome!</b>
                            </Typography>
                            <Typography level="body-sm">Sign in to continue.</Typography>
                        </div>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                type="email"
                                placeholder="yourname@email.com"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                type="password"
                                placeholder="password"
                            />
                        </FormControl>
                        <Typography sx={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
                            <Typography sx={{ marginRight: "0.5em" }}>Login as: </Typography>
                            <ToggleButtonGroup
                                value={isDoctor ? "doctor" : "patient"}
                                onChange={(event, newValue) => { newValue === "doctor" ? setIsDoctor(true) : setIsDoctor(false) }}
                            >
                                <Button value="doctor">Doctor</Button>
                                <Button value="patient">Patient</Button>
                            </ToggleButtonGroup>
                        </Typography>
                        <Button sx={{ mt: 1 }} onClick={e => handleSubmit(e)}>Log in</Button>
                        <Typography
                            endDecorator={<Link to="/register"><MuiLink>Register</MuiLink></Link>}
                            fontSize="sm"
                            sx={{ alignSelf: 'center' }}
                        >
                            Don&apos;t have an account?
                        </Typography>
                    </Sheet>
                </Sheet>
            </main>
        </>
    );
}