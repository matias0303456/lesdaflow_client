import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, IconButton, Input, InputLabel, LinearProgress, MenuItem, Select, Tooltip, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";
import { ClientFilter } from "../components/filters/ClientFilter";

import { CLIENT_URL } from "../utils/urls";

export function Clients() {

    const { auth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, destroy } = useApi(CLIENT_URL)
    const { clients, setClients, loadingClients, setLoadingClients } = useClients()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            code: '',
            name: '',
            email: '',
            address: '',
            phone: '',
            work_place: '',
            observations: ''
        },
        rules: {
            code: {
                required: true,
                maxLength: 55
            },
            name: {
                required: true,
                maxLength: 55
            },
            email: {
                maxLength: 55
            },
            address: {
                required: true,
                maxLength: 55
            },
            phone: {
                required: true,
                maxLength: 55
            },
            work_place: {
                maxLength: 55
            },
            observations: {
                maxLength: 55
            }
        }
    })

    const [open, setOpen] = useState(null)

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setClients(data)
                setLoadingClients(false)
            }
        })()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setClients([data, ...clients])
                    setMessage('Cliente creado correctamente.')
                } else {
                    setClients([data, ...clients.filter(c => c.id !== formData.id)])
                    setMessage('Cliente editado correctamente.')
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
        setLoadingClients(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setClients([...clients.filter(c => !ids.includes(c.id))])
            setMessage(`${result.length === 1 ? 'Cliente eliminado' : 'Clientes eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            if (result.some(r => r.status === 300)) {
                setMessage('Existen clientes con datos asociados.')
            } else {
                setMessage('Ocurrió un error. Actualice la página.')
            }
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingClients(false)
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
            id: 'code',
            numeric: false,
            disablePadding: true,
            label: 'Código',
            accessor: 'code'
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre y apellido',
            accessor: 'name'
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Email',
            sorter: (row) => row.email,
            accessor: 'email'
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            accessor: 'address'
        },
        {
            id: 'phone',
            numeric: false,
            disablePadding: true,
            label: 'Teléfono',
            accessor: 'phone'
        },
        {
            id: 'work_place',
            numeric: false,
            disablePadding: true,
            label: 'Lug. trabajo',
            sorter: (row) => row.work_place ?? '',
            accessor: 'work_place'
        },
        {
            id: 'observations',
            numeric: false,
            disablePadding: true,
            label: 'Observaciones',
            sorter: (row) => row.observations ?? '',
            accessor: 'observations'
        }
    ]

    return (
        <Layout title="Clientes">
            {loadingClients || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    title=""
                    headCells={auth.user.role.name !== 'ADMINISTRADOR' ?
                        headCells :
                        [
                            ...headCells,
                            {
                                id: 'seller',
                                numeric: false,
                                disablePadding: true,
                                label: 'Vendedor',
                                sorter: (row) => row.user.username.toLowerCase(),
                                accessor: (row) => row.user.username
                            }
                        ]
                    }
                    rows={clients}
                    open={open}
                    setOpen={setOpen}
                    data={formData}
                    setData={setFormData}
                    handleDelete={handleDelete}
                    deadlineColor="clients"
                    actions={
                        <>
                            <Tooltip title="Visualizar" onClick={() => setOpen('VIEW')}>
                                <IconButton>
                                    <SearchSharpIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar" onClick={() => setOpen('EDIT')}>
                                <IconButton>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    }
                    filter={<ClientFilter clients={clients} setClients={setClients} />}
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            {open === 'NEW' && 'Nuevo cliente'}
                            {open === 'EDIT' && 'Editar cliente'}
                        </Typography>
                        <form onChange={handleChange} onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 3 }}>
                                    <FormControl>
                                        <InputLabel htmlFor="code">Código</InputLabel>
                                        <Input id="code" type="text" name="code" value={formData.code} />
                                        {errors.code?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El código es requerido.
                                            </Typography>
                                        }
                                        {errors.name?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El código es demasiado largo.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="name">Nombre y Apellido</InputLabel>
                                        <Input id="name" type="text" name="name" value={formData.name} />
                                        {errors.name?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El nombre y apellido es requerido.
                                            </Typography>
                                        }
                                        {errors.name?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El nombre y apellido es demasiado largo.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="email">Email</InputLabel>
                                        <Input id="email" type="text" name="email" value={formData.email} />
                                        {errors.email?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El email es demasiado largo.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="address">Dirección</InputLabel>
                                        <Input id="address" type="text" name="address" value={formData.address} />
                                        {errors.address?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La dirección es requerida.
                                            </Typography>
                                        }
                                        {errors.address?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La dirección es demasiado larga.
                                            </Typography>
                                        }
                                    </FormControl>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 3 }}>
                                    <FormControl>
                                        <InputLabel htmlFor="phone">Teléfono</InputLabel>
                                        <Input id="phone" type="number" name="phone" value={formData.phone} />
                                        {errors.phone?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El teléfono es requerido.
                                            </Typography>
                                        }
                                        {errors.phone?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El teléfono es demasiado largo.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="work_place">Lugar de trabajo</InputLabel>
                                        <Input id="work_place" type="text" name="work_place" value={formData.work_place} />
                                        {errors.work_place?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El lugar de trabajo es demasiado largo.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="observations">Observaciones</InputLabel>
                                        <Input id="observations" type="text" name="observations" value={formData.observations} />
                                        {errors.observations?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * Las observaciones son demasiado largas.
                                            </Typography>
                                        }
                                    </FormControl>
                                </Box>
                            </Box>
                            <FormControl sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                justifyContent: 'center',
                                margin: '0 auto',
                                marginTop: 5,
                                width: '50%'
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
                        </form>
                    </ModalComponent>
                </DataGrid>
            }
        </Layout >
    )
}