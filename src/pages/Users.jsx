import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";

import { DataGrid } from "../components/DataGrid";
import { Layout } from "../components/Layout";
import { ModalComponent } from "../components/ModalComponent";

import { ROLE_URL, USER_URL } from "../utils/urls";

export function Users() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)
    const { auth } = useContext(AuthContext)

    const { get: getUsers, post, put, destroy } = useApi(USER_URL)
    const { get: getRoles } = useApi(ROLE_URL)
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            password: '',
            role_id: ''
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
            username: {
                required: true,
                maxLength: 55
            },
            email: {
                required: true,
                maxLength: 55
            },
            password: {
                required: true,
                minLength: 8,
                maxLength: 255
            },
            role_id: {
                required: true
            }
        }
    })

    const [loadingUsers, setLoadingUsers] = useState(true)
    const [loadingRoles, setLoadingRoles] = useState(true)
    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [open, setOpen] = useState(null)

    useEffect(() => {
        (async () => {
            const { status, data } = await getUsers()
            if (status === 200) {
                setUsers(data)
                setLoadingUsers(false)
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            const { status, data } = await getRoles()
            if (status === 200) {
                setRoles(data)
                setLoadingRoles(false)
            }
        })()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setUsers([data, ...users])
                    setMessage('Usuario creado correctamente.')
                } else {
                    setUsers([data, ...users.filter(u => u.id !== formData.id)])
                    setMessage('Usuario editado correctamente.')
                }
                setSeverity('success')
                reset(setOpen)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        }
    }

    async function handleDelete(elements) {
        setLoadingUsers(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setUsers([...users.filter(u => !ids.includes(u.id))])
            setMessage(`${result.length === 1 ? 'Usuario eliminado' : 'Usuarios eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingUsers(false)
        setOpen(null)
    }

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N°',
            accessor: 'id'
        },
        {
            id: 'first_name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            accessor: 'first_name'
        },
        {
            id: 'last_name',
            numeric: false,
            disablePadding: true,
            label: 'Apellido',
            accessor: 'last_name'
        },
        {
            id: 'username',
            numeric: false,
            disablePadding: true,
            label: 'Usuario',
            accessor: 'username'
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Email',
            accessor: 'email'
        },
        {
            id: 'role',
            numeric: false,
            disablePadding: true,
            label: 'Rol',
            accessor: (row) => row.role.name
        },
    ]

    return (
        <Layout title="Usuarios">
            {loadingUsers || loadingRoles || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    title="Usuarios del sistema"
                    headCells={headCells}
                    rows={users.filter(u => u.id !== auth.user.id)}
                    open={open}
                    setOpen={setOpen}
                    data={formData}
                    setData={setFormData}
                    handleDelete={handleDelete}
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            {open === 'NEW' && 'Nuevo usuario'}
                            {open === 'EDIT' && 'Editar usuario'}
                        </Typography>
                        <form onChange={handleChange} onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <FormControl>
                                    <InputLabel htmlFor="first_name">Nombre</InputLabel>
                                    <Input id="first_name" type="text" name="first_name" value={formData.first_name} />
                                    {errors.first_name?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El nombre es requerido.
                                        </Typography>
                                    }
                                    {errors.first_name?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El nombre es demasiado largo.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="last_name">Apellido</InputLabel>
                                    <Input id="last_name" type="text" name="last_name" value={formData.last_name} />
                                    {errors.last_name?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El apellido es requerido.
                                        </Typography>
                                    }
                                    {errors.last_name?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El apellido es demasiado largo.
                                        </Typography>
                                    }
                                </FormControl>
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
                                {open === 'NEW' &&
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
                                                * Este valor es demasiado corto.
                                            </Typography>
                                        }
                                        {errors.password?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La contraseña es demasiado larga.
                                            </Typography>
                                        }
                                    </FormControl>
                                }
                                <FormControl>
                                    <InputLabel id="role-select">Rol</InputLabel>
                                    <Select
                                        labelId="role-select"
                                        id="role_id"
                                        value={formData.role_id}
                                        label="Rol"
                                        name="role_id"
                                        onChange={handleChange}
                                    >
                                        {roles.filter(r => r.name !== 'SUPER_ADMIN').map(r => (
                                            <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.role_id?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El rol es requerido.
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
                                    <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{
                                        width: '50%'
                                    }}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={disabled} sx={{
                                        width: '50%'
                                    }}>
                                        Guardar
                                    </Button>
                                </FormControl>
                            </Box>
                        </form>
                    </ModalComponent>
                </DataGrid>
            }
        </Layout>
    )
}