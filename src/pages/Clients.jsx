import { useContext, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { useClients } from "../hooks/useClients";
import { useSellers } from "../hooks/useSellers";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";
import { ClientFilter } from "../components/filters/ClientFilter";

import { CLIENT_URL } from "../utils/urls";

export function Clients() {

    const { auth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { post, put, destroy } = useApi(CLIENT_URL)
    const { clients, setClients, loadingClients, setLoadingClients } = useClients()
    const { sellers, loadingSellers } = useSellers()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            first_name: '',
            last_name: '',
            document_type: '',
            document_number: '',
            gender_type: '',
            birth: '',
            cell_phone: '',
            local_phone: '',
            email: '',
            address: '',
            phone: '',
            work_place: '',
            seller_id: ''
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
            work_place: {
                maxLength: 255
            },
            seller_id: {
                required: true
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
            label: "Nro. Documento/CUIT",
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
            id: "work_place",
            numeric: false,
            disablePadding: true,
            label: "Nombre Comercio",
            accessor: "work_place",
        }
    ];

    return (
        <Layout title="Clientes">
            {loadingClients || disabled || loadingSellers ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    headCells={auth.user.role.name !== 'ADMINISTRADOR' ?
                        headCells :
                        [
                            ...headCells,
                            {
                                id: "seller_id",
                                numeric: false,
                                disablePadding: true,
                                label: "Vendedor",
                                sorter: (row) => `${row.seller.first_name} ${row.seller.last_name}`,
                                accessor: (row) => `${row.seller.first_name} ${row.seller.last_name}`,
                            }
                        ]
                    }
                    rows={clients}
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
                                <Button variant="outlined" color='error'>
                                    PDF
                                </Button>
                            </Box>
                            <ClientFilter clients={clients} setClients={setClients} />
                        </Box>
                    }
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT' || open === 'VIEW'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6">
                            {open === 'NEW' && 'Nuevo cliente'}
                            {open === 'EDIT' && 'Editar cliente'}
                            {open === 'VIEW' && `Cliente ${formData.name}`}
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
                                        <InputLabel id="gender-select">Sexo</InputLabel>
                                        <Select
                                            labelId="gender-select"
                                            id="gender__type"
                                            value={formData.gender_type}
                                            label="Sexo"
                                            name="gender_type"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="MASCULINO">MASCULINO</MenuItem>
                                            <MenuItem value="FEMENINO">FEMENINO</MenuItem>
                                        </Select>
                                    </FormControl>
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
                                                disabled={auth.user.role.name !== 'ADMINISTRADOR' && open === 'EDIT'}
                                            />
                                        </LocalizationProvider>
                                        {errors.birth?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La fecha de nacimiento es requerida.
                                            </Typography>
                                        }
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
                                        <InputLabel htmlFor="email">Email</InputLabel>
                                        <Input id="email" type="text" name="email" value={formData.email} disabled={open === 'VIEW'} />
                                    </FormControl>
                                    <FormControl sx={{ width: '50%' }}>
                                        <InputLabel htmlFor="work_place">Nombre comercio</InputLabel>
                                        <Input id="work_place" type="text" name="work_place" value={formData.work_place} disabled={open === 'VIEW'} />
                                        {errors.work_place?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El nombre del comercio es demasiado largo.
                                            </Typography>
                                        }
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
                                    <FormControl sx={{ width: '50%' }}>
                                        <InputLabel id="seller-select">Vendedor</InputLabel>
                                        <Select
                                            labelId="seller-select"
                                            id="seller_id"
                                            value={formData.seller_id}
                                            label="Vendedor"
                                            name="seller_id"
                                            onChange={handleChange}
                                        >
                                            {sellers.map(s => (
                                                <MenuItem key={s.id} value={s.id}>{`${s.first_name} ${s.last_name}`}</MenuItem>
                                            ))}
                                        </Select>
                                        {errors.seller_id?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El vendedor es requerido.
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
        </Layout >
    )
}