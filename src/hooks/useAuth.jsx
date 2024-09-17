import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../providers/AuthProvider";

export function useAuth() {

    const { setAuth } = useContext(AuthContext)

    const navigate = useNavigate()

    const handleLogout = () => {
        setAuth(null);
        localStorage.removeItem('auth_mga');
        navigate("/login");
    }

    return { handleLogout }
}