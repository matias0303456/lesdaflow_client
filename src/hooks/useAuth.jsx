import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../providers/AuthProvider";
import { useQuery } from "./useQuery";
import { AUTH_URL } from "../utils/urls";

export function useAuth() {

    const { auth, setAuth } = useContext(AuthContext)

    const navigate = useNavigate()

    const { handleQuery } = useQuery()

    const handleLogout = () => {
        handleQuery({
            url: AUTH_URL + '/logout',
            method: 'POST',
            token: auth?.refresh_token
        })
        localStorage.removeItem('auth_prestamos')
        setAuth(null)
        navigate('/')
    }

    return { handleLogout }
}