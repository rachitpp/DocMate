import axios from "axios";
import { useStore } from "../store/store";
import { logout, setAuth } from "../store/reducers/userActions";
import { jwtDecode } from "jwt-decode";

const useAxios = () => {
    const [state, dispatch] = useStore();

    const axiosA = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        timeout: 5000,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.accessToken}`,
        },
        validateStatus: (status) => {
            return true
        }
    });

    const refreshToken = async () => {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/auth/refresh-token`,
            {},
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            }
        );

        if (!response.data.error && response.data.accessToken) {
            dispatch(setAuth(response.data.accessToken, true));
            return response.data.accessToken;
        } else {
            console.log("logging out because couldn't refresh");
            dispatch(logout());
            return "";
        }
    };

    axiosA.interceptors.request.use(
        async (request) => {
            request.headers["Authorization"] = `Bearer ${state.accessToken}`;
            let isExpired = true;
            try {
                const { exp } = await jwtDecode(state.accessToken);
                isExpired = Date.now() >= exp * 1000;
                if (!isExpired) {
                    return request;
                }
            } catch (err) {
            }
            const accessToken = await refreshToken();
            request.headers["Authorization"] = `Bearer ${accessToken}`;
            return request;
        },
        function (error) {
            console.log("axios error req", error);
            return Promise.reject(error);
        }
    );

    axiosA.interceptors.response.use(
        async (response) => {
            if (!response.data.error && response.data.accessToken) {
                dispatch(setAuth(response.data.accessToken, true));
            }
            return response;
        },
        async (error) => {
            console.log("axios error", error, error.response?.data?.error);
            if (error?.response?.data?.authFailed) {
                dispatch(logout());
            }
            return Promise.reject(error);
        }
    );

    return axiosA;
};

export default useAxios;
