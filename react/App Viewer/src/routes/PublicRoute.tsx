import { Navigate, Outlet, useLocation, type Location } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type PublicRouteState = {
    from?: Location;
};

export default function PublicRoute() {
    const { isAuthed } = useAuth();
    const location = useLocation();

    if (isAuthed) {
        const state = location.state as PublicRouteState | null;
        const to = state?.from?.pathname ?? "/";
        return <Navigate to={to} replace />;
    }

    return <Outlet />;
}
