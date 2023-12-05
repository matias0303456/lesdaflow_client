import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";

export function Login() {

    const { setAuth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const navigate = useNavigate()

    const { login } = useAuth()

    const { formData, handleChange, disabled, setDisabled, validate, errors } = useForm({
        defaultData: { email: '', password: '' },
        rules: {
            email: { required: true, maxLength: 55 },
            password: { required: true, maxLength: 55 }
        }
    })

    const handleSubmit = async e => {
        e.preventDefault()
        if (validate()) {
            const { status, result } = await login(formData)
            if (status === 200) {
                localStorage.setItem('auth', JSON.stringify(result))
                setAuth(result)
                navigate('/inventario')
            } else {
                setMessage(result.message)
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
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input id="email" type="email" name="email" value={formData.email} />
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
                        <FormControl>
                            <InputLabel htmlFor="password">Contraseña</InputLabel>
                            <Input id="password" type="password" name="password" value={formData.password} />
                            {errors.password?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La contraseña es requerida.
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
                                marginTop: 1,
                                marginBottom: 4
                            }} disabled={disabled}>
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
            </Box>
        </Box>
    )
}