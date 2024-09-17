import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "./useQuery";

import { CHANGE_PASSWORD_URL } from "../utils/urls";

export function useAuth() {

    const { setAuth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const navigate = useNavigate()

    const { post } = useApi(CHANGE_PASSWORD_URL)

    const handleLogout = () => {
        setAuth(null);
        localStorage.removeItem('auth_mga');
        navigate("/login");
    }

    const changePassword = async (formData) => {
        const { status, data } = await post({
            current_password: formData.current_password,
            new_password: formData.new_password
        })
        if (status === 200) {
            setSeverity('success')
            setMessage(data.message)
            handleLogout()
        } else {
            setSeverity('error')
            setMessage('Ocurrió un error.')
        }
        setOpenMessage(true)
    }

    return { changePassword, handleLogout }
}