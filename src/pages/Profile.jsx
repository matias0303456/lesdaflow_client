import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, Input, InputLabel, Select, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useForm } from "../hooks/useForm";
import { useApi } from "../hooks/useApi";

import { Layout } from "../components/Layout";

import { CHANGE_PASSWORD_URL, USER_URL } from "../utils/urls";

export function Profile() {

    const { auth, setAuth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const navigate = useNavigate()

    const { put: putUsers } = useApi(USER_URL)
    const { put: putPwd } = useApi(CHANGE_PASSWORD_URL)
    const {
        formData: formDataUser,
        handleChange: handleChangeUser,
        disabled: disabledUser,
        setDisabled: setDisabledUser,
        validate: validateUser,
        errors: errorsUser
    } = useForm({
        defaultData: {
            id: auth?.user.id,
            first_name: auth?.user.first_name,
            last_name: auth?.user.last_name,
            email: auth?.user.email,
            username: auth?.user.username,
            role_id: auth?.user.role.id
        },
        rules: {
            first_name: {
                required: true,
                maxLength: 55
            },
            last_name: {
                required: true,
                maxLength: 55
            },
            email: {
                required: true,
                maxLength: 55
            },
            username: {
                required: true,
                maxLength: 55
            }
        }
    })
    const {
        formData: formDataPwd,
        handleChange: handleChangePwd,
        disabled: disabledPwd,
        setDisabled: setDisabledPwd,
        validate: validatePwd,
        errors: errorsPwd
    } = useForm({
        defaultData: {
            id: auth?.user.id,
            email: auth?.user.email,
            current: '',
            newPwd: '',
            repeat: ''
        },
        rules: {
            current: {
                required: true,
                minLength: 8,
                maxLength: 255
            },
            newPwd: {
                required: true,
                minLength: 8,
                maxLength: 255
            },
            repeat: {
                required: true,
                minLength: 8,
                maxLength: 255
            }
        }
    })

    const [dataHasChanged, setDataHasChanged] = useState(false)

    useEffect(() => {
        if (auth?.user.role.name !== 'ADMINISTRADOR') navigate('/veroshop/productos')
    }, [])

    useEffect(() => {
        if (
            formDataUser.first_name === auth?.user.first_name &&
            formDataUser.last_name === auth?.user.last_name &&
            formDataUser.username === auth?.user.username &&
            formDataUser.email === auth?.user.email) {
            setDataHasChanged(false)
        } else {
            setDataHasChanged(true)
        }
    }, [formDataUser])

    async function handleSubmitUser(e) {
        e.preventDefault()
        if (validateUser()) {
            const { status, data } = await putUsers(formDataUser)
            if (status === 200) {
                localStorage.removeItem('auth')
                setAuth(null)
                setMessage('Datos editados correctamente.')
                setSeverity('success')
                navigate('/veroshop/')
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabledUser(false)
            }
            setOpenMessage(true)
        }
    }

    async function handleSubmitPwd(e) {
        e.preventDefault()
        if (validatePwd() && formDataPwd.newPwd === formDataPwd.repeat) {
            const { status, data } = await putPwd(formDataPwd)
            if (status === 200) {
                navigate('/veroshop/')
                localStorage.removeItem('auth')
                setAuth(null)
                setSeverity('success')
                setMessage('Contraseña editada correctamente.')
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabledPwd(false)
            }
            setOpenMessage(true)
        }
    }

    return (
        <Layout title="Perfil">
            <Typography variant="h6">
                Editar mis datos
            </Typography>
            <Typography variant="caption" color="gray">
                * Si cambia sus datos, deberá iniciar sesión nuevamente.
            </Typography>
            <form onChange={handleChangeUser} onSubmit={handleSubmitUser} style={{ marginTop: 30 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: { sm: '80%', lg: '40%' } }}>
                    <FormControl>
                        <InputLabel htmlFor="first_name">Nombre</InputLabel>
                        <Input id="first_name" type="text" name="first_name" value={formDataUser.first_name} />
                        {errorsUser.first_name?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre es requerido.
                            </Typography>
                        }
                        {errorsUser.first_name?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="last_name">Apellido</InputLabel>
                        <Input id="last_name" type="text" name="last_name" value={formDataUser.last_name} />
                        {errorsUser.last_name?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El apellido es requerido.
                            </Typography>
                        }
                        {errorsUser.last_name?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El apellido es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="username">Usuario</InputLabel>
                        <Input id="username" type="text" name="username" value={formDataUser.username} />
                        {errorsUser.username?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre de usuario es requerido.
                            </Typography>
                        }
                        {errorsUser.username?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre de usuario es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input id="email" type="text" name="email" value={formDataUser.email} />
                        {errorsUser.email?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El email es requerido.
                            </Typography>
                        }
                        {errorsUser.email?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El email es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        justifyContent: 'center'
                    }}>
                        <Button type="submit" variant="contained" disabled={disabledUser || !dataHasChanged} sx={{
                            width: '50%'
                        }}>
                            Guardar
                        </Button>
                    </FormControl>
                </Box>
            </form>
            <Typography variant="h6" sx={{ marginTop: 10 }}>
                Cambiar contraseña
            </Typography>
            <form onChange={handleChangePwd} onSubmit={handleSubmitPwd}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: { sm: '80%', lg: '40%' }, marginTop: 2 }}>
                    <FormControl>
                        <InputLabel htmlFor="current">Contraseña actual</InputLabel>
                        <Input id="current" type="password" name="current" value={formDataPwd.current} />
                        {errorsPwd.current?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Este campo es requerido.
                            </Typography>
                        }
                        {errorsPwd.current?.type === 'minLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Este valor es demasiado corto.
                            </Typography>
                        }
                        {errorsPwd.current?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Este valor es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="newPwd">Contraseña nueva</InputLabel>
                        <Input id="newPwd" type="password" name="newPwd" value={formDataPwd.newPwd} />
                        {errorsPwd.newPwd?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Este campo es requerido.
                            </Typography>
                        }
                        {errorsPwd.newPwd?.type === 'minLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Este valor es demasiado corto.
                            </Typography>
                        }
                        {errorsPwd.newPwd?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Este valor es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="repeat">Repetir contraseña nueva</InputLabel>
                        <Input id="repeat" type="password" name="repeat" value={formDataPwd.repeat} />
                        {errorsPwd.repeat?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Este campo es requerido.
                            </Typography>
                        }
                        {errorsPwd.repeat?.type === 'minLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Este valor es demasiado corto.
                            </Typography>
                        }
                        {errorsPwd.repeat?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Este valor es demasiado largo.
                            </Typography>
                        }
                        {formDataPwd.newPwd === formDataPwd.repeat &&
                            formDataPwd.newPwd.length > 0 &&
                            formDataPwd.repeat.length > 0 &&
                            <Typography variant="caption" color="green" marginTop={1}>
                                * Las contraseñas coinciden.
                            </Typography>
                        }
                        {formDataPwd.newPwd !== formDataPwd.repeat &&
                            formDataPwd.newPwd.length > 0 &&
                            formDataPwd.repeat.length > 0 &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Las contraseñas no coinciden.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        justifyContent: 'center'
                    }}>
                        <Button type="submit" variant="contained" disabled={disabledPwd} sx={{
                            width: '50%'
                        }}>
                            Guardar
                        </Button>
                    </FormControl>
                </Box>
            </form>
        </Layout>
    )
}