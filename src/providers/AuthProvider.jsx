import { createContext, useContext, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material"

import { MessageContext } from "./MessageProvider";
import { useForm } from "../hooks/useForm";
import { useQuery } from "../hooks/useQuery";

import { ModalComponent } from "../components/common/ModalComponent";

import { AUTH_URL } from "../utils/urls";
import { STATUS_CODES } from "../utils/constants";

export const AuthContext = createContext({
    auth: null,
    setAuth: () => { },
    sessionExpired: false,
    setSessionExpired: () => { }
})

export function AuthProvider({ children }) {

    const { setOpenMessage, setSeverity, setMessage } = useContext(MessageContext)
    const { handleQuery } = useQuery()
    const { formData, errors, disabled, setDisabled, handleChange, validate } = useForm({
        defaultData: { username: '', password: '' },
        rules: {
            username: { required: true, maxLength: 55 },
            password: { required: true, minLength: 8, maxLength: 191 }
        }
    })

    const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('auth_prestamos')))
    const [sessionExpired, setSessionExpired] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = await handleQuery({
                url: AUTH_URL + '/login',
                method: 'POST',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.OK) {
                localStorage.setItem('solid_auth', JSON.stringify(data))
                window.location.reload()
            } else {
                if (status === STATUS_CODES.UNAUTHORIZED) {
                    setMessage('Credenciales inválidas.')
                    setSeverity('error')
                    setOpenMessage(true)
                }
            }
        }
        setDisabled(false)
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, sessionExpired, setSessionExpired }}>
            <ModalComponent open={sessionExpired} onClose={() => setSessionExpired(false)}>
                <Typography variant="h6" sx={{ color: '#000', marginBottom: 2 }} align="center">
                    Tu sesión expiró. Por favor ingresa de nuevo tu usuario y contraseña
                </Typography>
                <form onChange={handleChange} onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '50%', margin: 'auto' }}>
                        <FormControl>
                            <InputLabel htmlFor="username" sx={{ color: '#000' }}>Usuario</InputLabel>
                            <Input id="username" type="text" name="username" value={formData.username} sx={{ color: '#000' }} />
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
                            <InputLabel htmlFor="password" sx={{ color: '#000' }}>Contraseña</InputLabel>
                            <Input id="password" type="password" name="password" value={formData.password} sx={{ color: '#000' }} autoComplete="" />
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
                                    width: '50%',
                                    margin: '0 auto',
                                    marginTop: 1,
                                    color: '#fff'
                                }}
                                disabled={disabled}
                            >
                                Ingresar
                            </Button>
                        </FormControl>
                    </Box>
                </form>
            </ModalComponent>
            {children}
        </AuthContext.Provider>
    )
}