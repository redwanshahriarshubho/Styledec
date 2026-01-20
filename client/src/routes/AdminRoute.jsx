import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Create a simple hook that returns useContext(AuthContext)
import useRole from "../hooks/useRole"; // A hook to fetch user role from DB

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [role, isRoleLoading] = useRole(); // Logic: fetch /users/role/${user.email}
    const location = useLocation();

    if (loading || isRoleLoading) return <progress className="progress w-56"></progress>;

    if (user && role === 'admin') return children;

    return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default AdminRoute;