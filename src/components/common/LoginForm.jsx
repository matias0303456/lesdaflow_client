/* eslint-disable react/prop-types */
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { useForm } from "../../hooks/useForm";
import { AuthContext } from "../../providers/AuthProvider";
import { MessageContext } from "../../providers/MessageProvider";
import { useQuery } from "../../hooks/useQuery";

import { AUTH_URL } from "../../utils/urls";
import { STATUS_CODES } from "../../utils/constants";

export function LoginForm({ showLogo }) {

    const { auth, setAuth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const navigate = useNavigate()

    const { handleQuery } = useQuery()
    const { formData, handleChange, disabled, setDisabled, validate, errors } = useForm({
        defaultData: { username: '', password: '' },
        rules: {
            username: { required: true, maxLength: 55 },
            password: { required: true, minLength: 8, maxLength: 55 }
        }
    })

    useEffect(() => {
        if (auth) return navigate('/prestamos')
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()
        if (validate()) {
            const { status, data } = await handleQuery({
                url: AUTH_URL + '/login',
                method: 'POST',
                body: formData
            })
            if (status === STATUS_CODES.OK) {
                localStorage.setItem('auth_prestamos', JSON.stringify(data))
                setAuth(data)
                navigate('/prestamos')
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
            setDisabled(false)
        }
    }

    return (
        <Box sx={{ width: 300 }}>
            {showLogo &&
                <Box sx={{ textAlign: 'center', marginBottom: 1 }}>
                    <Typography variant='h2' mb={3}>
                        MoeGroup
                    </Typography>
                </Box>
            }
            <form onChange={handleChange} onSubmit={handleSubmit} style={{
                boxShadow: '0 0 10px #808080',
                padding: 25,
                borderRadius: 5,
                backgroundColor: '#fff'
            }}>
                <Typography variant="h6" color="#808080" textAlign="center">
                    INGRESO
                </Typography>
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
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                width: '100%',
                                margin: '0 auto',
                                marginTop: 1,
                                color: '#FFF'
                            }}
                            disabled={disabled}
                        >
                            INICIAR SESIÓN
                        </Button>
                    </FormControl>
                </Box>
            </form>
        </Box>
    )
}