import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, FormControl, Input, InputLabel, Snackbar, Typography } from "@mui/material";

import { useAuth } from "../hooks/useAuth";
import { AuthContext } from "../contexts/AuthContext";

export function Login() {

    const navigate = useNavigate()
    const { setAuth } = useContext(AuthContext)
    const { login } = useAuth()
    const [open, setOpen] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setDisabled(true)
        const { status, result } = await login(data)
        if (status === 200) {
            localStorage.setItem('auth', JSON.stringify(result))
            setAuth(result)
            navigate('/inventario')
        } else {
            setOpen(true)
        }
        setDisabled(false)
    }

    return (
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: 400 }}>
                <Typography variant="h3" gutterBottom textAlign="center">
                    Lesdaflow
                </Typography>
                <form onChange={handleChange} onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <FormControl>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input id="email" type="email" name="email" required />
                            {data.email.length > 55 &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El email es demasiado largo.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="password">Contraseña</InputLabel>
                            <Input id="password" type="password" name="password" required />
                            {data.password.length > 55 &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La contraseña es demasiado larga.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl>
                            <Button type="submit" variant="contained" sx={{
                                width: '50%',
                                margin: '0 auto',
                                marginTop: 1,
                                marginBottom: 4
                            }} disabled={
                                data.email.length === 0 || data.email.length > 55 ||
                                data.password.length === 0 || data.password.length > 55 || disabled
                            }>
                                Ingresar
                            </Button>
                        </FormControl>
                    </Box>
                </form>
                <Box textAlign="center">
                    <Button variant="text" onClick={() => navigate('/')}>
                        Volver al inicio
                    </Button>
                </Box>
                <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
                    <Alert severity="error" sx={{ width: '100%' }}>
                        Credenciales inválidas
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    )
}