import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "../hooks/useForm";

export function Home() {

    const { auth } = useContext(AuthContext)

    const navigate = useNavigate()

    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: { email: '' },
        rules: { email: { required: true, maxLength: 55 } }
    })

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
            <Box sx={{ padding: 5, paddingTop: 0 }}>
                <Typography variant="h2" color="white" textAlign="center" marginBottom={3}>
                    Solicita una licencia gratuita de prueba
                </Typography>
                <form style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 5
                }} onChange={handleChange}>
                    <FormControl sx={{ backgroundColor: 'white', borderRadius: 1, width: '30%' }}>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input id="email" type="email" name="email" value={formData.email} sx={{ paddingX: 1 }} />
                        {errors.email?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El email es requerido.
                            </Typography>
                        }
                        {errors.email?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El email es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        justifyContent: 'center',
                        marginTop: 1
                    }}>
                        <Button type="submit" variant="contained" sx={{
                            width: '40%'
                        }}>
                            Enviar
                        </Button>
                    </FormControl>
                </form>
            </Box>
        </Box>
    )
}