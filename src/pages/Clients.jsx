import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";

import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";

import { CLIENT_URL } from "../utils/urls";

export function Clients() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, destroy } = useApi(CLIENT_URL)
    const { clients, setClients, loadingClients, setLoadingClients } = useClients()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            name: '',
            email: '',
            address: '',
            city: '',
            province: ''
        },
        rules: {
            name: {
                required: true,
                maxLength: 55
            },
            email: {
                required: true,
                maxLength: 55
            },
            address: {
                required: true,
                maxLength: 55
            },
            city: {
                required: true,
                maxLength: 55
            },
            province: {
                required: true,
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
            setMessage('Ocurrió un error. Actualice la página.')
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
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            accessor: 'name'
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Email',
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
            id: 'city',
            numeric: false,
            disablePadding: true,
            label: 'Ciudad',
            accessor: 'city'
        },
        {
            id: 'province',
            numeric: false,
            disablePadding: true,
            label: 'Provincia',
            accessor: 'province'
        },
        {
            id: 'seller',
            numeric: false,
            disablePadding: true,
            label: 'Vendedor',
            accessor: (row) => row.user.username
        }
    ]

    return (
        <Layout title="Clientes">
            {loadingClients || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    title="Clientes registrados"
                    headCells={headCells}
                    rows={clients}
                    open={open}
                    setOpen={setOpen}
                    data={formData}
                    setData={setFormData}
                    handleDelete={handleDelete}
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            {open === 'NEW' && 'Nuevo cliente'}
                            {open === 'EDIT' && 'Editar cliente'}
                        </Typography>
                        <form onChange={handleChange} onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <FormControl>
                                    <InputLabel htmlFor="name">Nombre</InputLabel>
                                    <Input id="name" type="text" name="name" value={formData.name} />
                                    {errors.name?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El nombre es requerido.
                                        </Typography>
                                    }
                                    {errors.name?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El nombre es demasiado largo.
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
                                <FormControl>
                                    <InputLabel htmlFor="city">Ciudad</InputLabel>
                                    <Input id="city" type="text" name="city" value={formData.city} />
                                    {errors.city?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La ciudad es requerida.
                                        </Typography>
                                    }
                                    {errors.city?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La ciudad es demasiado larga.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="province">Provincia / Estado</InputLabel>
                                    <Input id="province" type="text" name="province" value={formData.province} />
                                    {errors.province?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La provincia es requerida.
                                        </Typography>
                                    }
                                    {errors.province?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La provincia es demasiado larga.
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