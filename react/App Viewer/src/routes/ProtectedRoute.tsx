import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute() {
    const { isAuthed } = useAuth();
    const location = useLocation();

    if (!isAuthed) {
        return <Navigate to="/auth" state={{ from: location }} />;
    }
    return <Outlet />;
}
