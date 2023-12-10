import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";

export function Home() {

    const { auth } = useContext(AuthContext)

    const navigate = useNavigate()

    useEffect(() => {
        if (auth) return navigate('/inventario')
    }, [])

    return (
        <Box sx={{ background: "linear-gradient(black, #140052)" }}>
            <Box display="flex" justifyContent="end" padding={3}>
                <Button
                    variant="outlined"
                    sx={{ color: "white", borderColor: "white" }}
                    onClick={() => navigate('/login')}
                >
                    Ingresar
                </Button>
            </Box>
            <Typography variant="h1" color="white" textAlign="center" sx={{
                fontSize: { xs: 50, sm: 96 }
            }}>
                Lesdaflow
            </Typography>
            <Box sx={{ padding: 5 }}>
                <Typography variant="body1" color="white" textAlign="left">
                    Administra los datos de tu negocio de forma segura e intuitiva.
                </Typography>
                <Typography variant="body1" color="white" textAlign="left">
                    Gestión de clientes y proveedores.
                </Typography>
                <Typography variant="body1" color="white" textAlign="left">
                    Gestión de inventario.
                </Typography>
                <Typography variant="body1" color="white" textAlign="left">
                    Gestión de productos y categorías.
                </Typography>
                <Typography variant="body1" color="white" textAlign="left">
                    Sin límite de usuarios.
                </Typography>
                <Typography variant="body1" color="white" textAlign="left">
                    Generación de reportes en PFD.
                </Typography>
            </Box>
        </Box>
    )
}