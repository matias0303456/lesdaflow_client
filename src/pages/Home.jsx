import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";

export function Home() {

    const { auth } = useContext(AuthContext)

    const navigate = useNavigate()

    useEffect(() => {
        if (auth) return navigate('/inventario')
    }, [])

    return (
        <div>
            <h1>home</h1>
            <Button variant="contained" onClick={() => navigate('/login')}>Ingresar</Button>
        </div>
    )
}