import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../store/store";

const ProtectedRoute = ({ children, redirectTo }) => {
    const [state] = useStore();
    const isAuthenticated = state.authenticated;
    if (isAuthenticated) {
        return <Outlet />;
    } else {
        return <Navigate to={redirectTo} replace />;
    }
};

export default ProtectedRoute;
