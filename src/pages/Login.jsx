import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { useForm } from "../hooks/useForm";
import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";

import { LOGIN_URL } from "../utils/urls";

export function Login() {

    const { auth, setAuth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const navigate = useNavigate()

    const { post } = useApi(LOGIN_URL)

    const { formData, handleChange, disabled, setDisabled, validate, errors } = useForm({
        defaultData: { username: '', password: '' },
        rules: {
            username: { required: true, maxLength: 55 },
            password: { required: true, minLength: 8, maxLength: 55 }
        }
    })

    useEffect(() => {
        if (auth) return navigate('/inventario')
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()
        if (validate()) {
            const { status, data } = await post(formData, true)
            if (status === 200) {
                localStorage.setItem('auth', JSON.stringify(data))
                setAuth(data)
                navigate('/inventario')
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
            setDisabled(false)
        }
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
                            <InputLabel htmlFor="username">Usuario</InputLabel>
                            <Input id="username" type="text" name="username" value={formData.username} />
                            {errors.username?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El nombre de usuario es requerido.
                                </Typography>
                            }
                            {errors.username?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El nombre de usuario es demasiado largo.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="password">Contraseña</InputLabel>
                            <Input id="password" type="password" name="password" value={formData.password} />
                            {errors.password?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La contraseña es requerida.
                                </Typography>
                            }
                            {errors.password?.type === 'minLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La contraseña es demasiado corta.
                                </Typography>
                            }
                            {errors.password?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La contraseña es demasiado larga.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl>
                            <Button type="submit" variant="contained" sx={{
                                width: '50%',
                                margin: '0 auto',
                                marginTop: 1
                            }} disabled={disabled}>
                                Ingresar
                            </Button>
                        </FormControl>
                    </Box>
                </form>
                <Box textAlign="center" sx={{ marginTop: 4 }}>
                    <Button variant="text" onClick={() => navigate('/')}>
                        Volver al inicio
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}