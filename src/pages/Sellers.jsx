import { useContext, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { MessageContext } from "../providers/MessageProvider";
import { useSellers } from '../hooks/useSellers'
import { useForm } from '../hooks/useForm'
import { useApi } from "../hooks/useApi";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";

import { USER_URL } from "../utils/urls";

export function Sellers() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { loadingSellers, sellers, setSellers } = useSellers()
    const { post, put, destroy } = useApi(USER_URL)
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            first_name: '',
            last_name: '',
            document_type: '',
            document_number: '',
            birth: new Date(Date.now()),
            cell_phone: '',
            local_phone: '',
            email: '',
            address: '',
            username: '',
            password: '',
            role: 'VENDEDOR'
        },
        rules: {
            first_name: {
                required: true,
                maxLength: 255
            },
            last_name: {
                required: true,
                maxLength: 255
            },
            document_number: {
                maxLength: 255
            },
            cell_phone: {
                maxLength: 255
            },
            address: {
                required: true,
                maxLength: 255
            },
            username: {
                required: true,
                maxLength: 255
            },
            password: {
                required: true,
                maxLength: 255
            }
        }
    })

    const [open, setOpen] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setSellers([data, ...sellers])
                    setMessage('Vendedor creado correctamente.')
                } else {
                    setSellers([data, ...sellers.filter(s => s.id !== formData.id)])
                    setMessage('Vendedor editado correctamente.')
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

    const headCells = [
        {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: "Nombre y apellido",
            accessor: (row) => `${row.first_name} ${row.last_name}`,
        },
        {
            id: "document_number",
            numeric: false,
            disablePadding: true,
            label: "Nro. Documento",
            accessor: "document_number",
        },
        {
            id: "cell_phone",
            numeric: false,
            disablePadding: true,
            label: "Celular",
            accessor: "cell_phone",
        },
        {
            id: "local_phone",
            numeric: false,
            disablePadding: true,
            label: "Teléfono",
            accessor: "cell_phone",
        },
        {
            id: "email",
            numeric: false,
            disablePadding: true,
            label: "Email",
            sorter: (row) => row.email,
            accessor: "email",
        },
        {
            id: "address",
            numeric: false,
            disablePadding: true,
            label: "Dirección",
            accessor: "address",
        }
    ];

    return (
        <Layout title="Personal">
            {loadingSellers ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    headCells={headCells}
                    rows={sellers}
                    setOpen={setOpen}
                    setData={setFormData}
                    showEditAction
                    showDeleteAction
                    showViewAction
                    contentHeader={
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" onClick={() => setOpen('NEW')}>
                                    Agregar
                                </Button>
                                <Button variant="outlined" color='success'>
                                    Excel
                                </Button>
                            </Box>
                        </Box>
                    }
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT' || open === 'VIEW'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" marginBottom={1}>
                            {open === 'NEW' && 'Nuevo vendedor'}
                            {open === 'EDIT' && 'Editar vendedor'}
                            {open === 'VIEW' && `Vendedor ${formData.name}`}
                        </Typography>
                        <form onChange={handleChange} onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box sx={{ display: 'flex', gap: 5 }}>
                                    <FormControl sx={{ width: '50%' }}>
                                        <InputLabel htmlFor="first_name">Nombres</InputLabel>
                                        <Input id="first_name" type="text" name="first_name" value={formData.first_name} disabled={open === 'VIEW'} />
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
                                    <FormControl sx={{ width: '50%' }}>
                                        <InputLabel htmlFor="last_name">Apellidos</InputLabel>
                                        <Input id="last_name" type="text" name="last_name" value={formData.last_name} disabled={open === 'VIEW'} />
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
                                </Box>
                                <Box sx={{ display: 'flex', gap: 5 }}>
                                    <FormControl sx={{ width: '50%' }}>
                                        <InputLabel htmlFor="username">Usuario</InputLabel>
                                        <Input id="username" type="text" name="username" value={formData.username} disabled={open === 'VIEW'} />
                                        {errors.username?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El usuario es requerido.
                                            </Typography>
                                        }
                                        {errors.username?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El usuario es demasiado largo.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl sx={{ width: '50%' }}>
                                        <InputLabel htmlFor="password">Contraseña</InputLabel>
                                        <Input id="password" type="password" name="password" value={formData.password} disabled={open === 'VIEW'} />
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
                                </Box>
                                <Box sx={{ display: 'flex', gap: 5 }}>
                                    <FormControl sx={{ width: '50%' }}>
                                        <InputLabel id="type-select">Tipo documento</InputLabel>
                                        <Select
                                            labelId="type-select"
                                            id="document_type"
                                            value={formData.document_type}
                                            label="Tipo documento"
                                            name="document_type"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="DNI">DNI</MenuItem>
                                            <MenuItem value="LE">LE</MenuItem>
                                            <MenuItem value="CUIL">CUIL</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ width: '50%' }}>
                                        <InputLabel htmlFor="document_number">Nro. documento / CUIT</InputLabel>
                                        <Input id="document_number" type="text" name="document_number" value={formData.document_number} disabled={open === 'VIEW'} />
                                    </FormControl>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 5 }}>
                                    <FormControl sx={{ width: '50%' }}>
                                        <InputLabel htmlFor="cell_phone">Celular</InputLabel>
                                        <Input id="cell_phone" type="number" name="cell_phone" value={formData.cell_phone} disabled={open === 'VIEW'} />
                                        {errors.cell_phone?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El celular es demasiado largo.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl sx={{ width: '50%' }}>
                                        <InputLabel htmlFor="local_phone">Teléfono</InputLabel>
                                        <Input id="local_phone" type="number" name="local_phone" value={formData.local_phone} disabled={open === 'VIEW'} />
                                    </FormControl>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 5 }}>
                                    <FormControl sx={{ width: '50%' }}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                            <DatePicker
                                                label="Fecha nacimiento"
                                                value={new Date(formData.birth)}
                                                onChange={value => handleChange({
                                                    target: {
                                                        name: 'birth',
                                                        value: new Date(value.toISOString())
                                                    }
                                                })}
                                            />
                                        </LocalizationProvider>
                                        {errors.birth?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La fecha de nacimiento es requerida.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl sx={{ width: '50%' }}>
                                        <InputLabel htmlFor="email">Email</InputLabel>
                                        <Input id="email" type="text" name="email" value={formData.email} disabled={open === 'VIEW'} />
                                    </FormControl>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 5 }}>
                                    <FormControl sx={{ width: '50%' }}>
                                        <InputLabel htmlFor="address">Dirección</InputLabel>
                                        <Input id="address" type="text" name="address" value={formData.address} disabled={open === 'VIEW'} />
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
                            </Box>
                            <FormControl sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                justifyContent: 'center',
                                margin: '0 auto',
                                marginTop: 3,
                                width: '50%'
                            }}>
                                <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{
                                    width: '50%'
                                }}>
                                    {open === 'VIEW' ? 'Cerrar' : 'Cancelar'}
                                </Button>
                                {(open === 'NEW' || open === 'EDIT') &&
                                    <Button type="submit" variant="contained" disabled={disabled} sx={{
                                        width: '50%'
                                    }}>
                                        Confirmar
                                    </Button>
                                }
                            </FormControl>
                        </form>
                    </ModalComponent>
                </DataGrid>
            }
        </Layout>
    )
}