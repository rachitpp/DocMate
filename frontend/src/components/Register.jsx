import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStore } from '../store/store';
import axios from 'axios';
import { setAuth, setUser } from '../store/reducers/userActions';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import MuiLink from '@mui/joy/Link';
import { Link } from 'react-router-dom';
import { Option, Radio, RadioGroup, Select, ToggleButtonGroup } from '@mui/joy';

export default function Register() {
    const navigate = useNavigate();
    const [isDoctor, setIsDoctor] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobileNumber, setMobileNumber] = useState("+91");
    const [gender, setGender] = useState("");
    const [height, setHeight] = useState(180);
    const [weight, setWeight] = useState(75);
    const [dob, setDob] = useState(new Date());
    const [state, dispatch] = useStore();
    const [pincodes, setPincodes] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [selectedPincode, setSelectedPincode] = useState(undefined);
    const [selectedHospital, setSelectedHospital] = useState(undefined);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(process.env.REACT_APP_API_URL + "/auth/register", {
                name, email, password, mobile_number: mobileNumber, gender, type: isDoctor ? "doctor" : "patient", hospital: isDoctor ? selectedHospital : undefined, pincode: !isDoctor ? selectedPincode : undefined, height: !isDoctor ? height : undefined, weight: !isDoctor ? weight : undefined, dob: !isDoctor ? dob : undefined
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

    async function fetchPincodes() {
        const pincodes = await axios.get(`${process.env.REACT_APP_API_URL}/auth/pincodes`);
        setPincodes(pincodes.data);
    }

    async function fetchHospitals() {
        const hospitals = await axios.get(`${process.env.REACT_APP_API_URL}/auth/hospitals?pincode=${selectedPincode}`);
        setHospitals(hospitals.data);
    }

    useEffect(() => {
        if (state.authenticated) {
            navigate(`/${state?.user?.role}/dashboard`);
            return toast.success('Welcome to DocMate', {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }, [state.authenticated, navigate]);

    useEffect(() => {
        setHospitals([]);
        fetchHospitals();
    }, [selectedPincode]);

    useEffect(() => {
        fetchPincodes();
    }, []);

    const handleLoginType = (isDoctorLogin) => {
        setIsDoctor(isDoctorLogin);
    };

    return (
        <>
            <main>
                <Sheet sx={{
                    width: "100vw", height: "100vh", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center"
                }}>
                    <CssBaseline />
                    <Sheet
                        sx={{
                            width: 400,
                            mx: 'auto',
                            my: 4,
                            py: 3,
                            px: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            borderRadius: 'sm',
                            boxShadow: 'md', maxHeight: "95vh", overflow: "hidden auto"
                        }}
                        variant="outlined"
                    >
                        <div>
                            <Typography level="h4" component="h1">
                                <b>Welcome!</b>
                            </Typography>
                            <Typography level="body-sm">Register for Docmate.</Typography>
                        </div>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                type="text"
                                placeholder="Ankit"
                            />
                        </FormControl>
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
                            <FormLabel>Phone no.</FormLabel>
                            <Input
                                value={mobileNumber}
                                onChange={e => setMobileNumber(e.target.value)}
                                type="text"
                                placeholder="+91"
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
                        <FormControl>
                            <RadioGroup defaultValue="" name="radio-buttons-group" sx={{ display: "flex", alignItems: "center", justifyContent: "start", flexDirection: "row", margin: 0 }}>
                                <Radio value="male" onChange={e => setGender(e.target.value)} label="Male" variant="outlined" sx={{ margin: 0, padding: "0.25rem" }} />
                                <Radio value="female" onChange={e => setGender(e.target.value)} label="Female" variant="outlined" sx={{ margin: 0, padding: "0.25rem" }} />
                            </RadioGroup>
                        </FormControl>
                        <Typography sx={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
                            <Typography sx={{ marginRight: "0.5em" }}>Register as: </Typography>
                            <ToggleButtonGroup
                                value={isDoctor ? "doctor" : "patient"}
                                onChange={(event, newValue) => { newValue === "doctor" ? setIsDoctor(true) : setIsDoctor(false) }}
                            >
                                <Button value="doctor">Doctor</Button>
                                <Button value="patient">Patient</Button>
                            </ToggleButtonGroup>
                        </Typography>
                        <Select placeholder="Choose your pincode" defaultValue={pincodes.length > 0 ? pincodes[0] : "fetching pincodes"} onChange={(e, newValue) => { setSelectedPincode(newValue) }}>
                            {pincodes.map(x => (<Option value={x}>{x}</Option>))}
                        </Select>
                        {isDoctor && <>
                            <Select placeholder="Choose your hospital" defaultValue={hospitals.length > 0 ? hospitals[0] : "fetching hospitals"} onChange={(e, newValue) => { setSelectedHospital(newValue) }}>
                                {hospitals.length > 0 && <>{hospitals.map(x => (<Option value={x?._id}>{x?.hospitalName}</Option>))}</>}
                            </Select>
                        </>}
                        {!isDoctor && <>
                            <FormLabel>Height</FormLabel>
                            <Input
                                value={height}
                                onChange={e => setHeight(e.target.value)}
                                type="number"
                                placeholder="175"
                            />
                            <FormLabel>Weight</FormLabel>
                            <Input
                                value={weight}
                                onChange={e => setWeight(e.target.value)}
                                type="number"
                                placeholder="75"
                            />
                            <FormLabel>Date of Birth</FormLabel>
                            <Input
                                value={dob}
                                onChange={e => setDob(e.target.value)}
                                type="date"
                            />
                        </>}
                        <Button sx={{ mt: 1 }} onClick={e => handleSubmit(e)}>Register</Button>
                        <Typography
                            endDecorator={<Link to="/login"><MuiLink>Log in</MuiLink></Link>}
                            fontSize="sm"
                            sx={{ alignSelf: 'center' }}
                        >
                            Already have an account?
                        </Typography>
                    </Sheet>
                </Sheet>
            </main>
        </>
    );
}