import { useContext, useEffect } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useClients } from "../hooks/useClients";
import { useSellers } from "../hooks/useSellers";

import { Layout } from "../components/Layout";
import { ModalComponent } from "../components/ModalComponent";
import { DataGridWithBackendPagination } from "../components/DataGridWithBackendPagination";
// import { ClientFilter } from "../components/filters/ClientFilter";

export function Clients() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const { loadingClients, handleSubmit, handleDelete, open, setOpen, getClients } = useClients()
    const { sellers, loadingSellers, getSellers } = useSellers()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            first_name: '',
            last_name: '',
            document_type: '',
            document_number: '',
            gender_type: '',
            birth: new Date(Date.now()),
            cell_phone: '',
            local_phone: '',
            email: '',
            address: '',
            work_place: '',
            user_id: ''
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
                required: true,
                maxLength: 255
            },
            local_phone: {
                maxLength: 255
            },
            address: {
                required: true,
                maxLength: 255
            },
            work_place: {
                required: true,
                maxLength: 255
            },
            user_id: {
                required: true
            }
        }
    })

    useEffect(() => {
        getSellers()
    }, [])

    const headCells = [
        {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: "Nombre y apellido",
            accessor: (row) => `${row.first_name} ${row.last_name}`
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
            label: 'Nombre comercio',
            sorter: (row) => row.work_place ?? '',
            accessor: 'work_place'
        }
    ];

    return (
        <Layout title="Clientes">
            <DataGridWithBackendPagination
                headCells={auth.user.role !== 'ADMINISTRADOR' ?
                    headCells :
                    [
                        ...headCells,
                        {
                            id: "user_id",
                            numeric: false,
                            disablePadding: true,
                            label: "Vendedor",
                            sorter: (row) => `${row.user.first_name} ${row.user.last_name}`,
                            accessor: (row) => `${row.user.first_name} ${row.user.last_name}`,
                        }
                    ]
                }
                loading={loadingClients || disabled || loadingSellers}
                rows={state.clients.data}
                entityKey="clients"
                getter={getClients}
                setOpen={setOpen}
                setFormData={setFormData}
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
                        {/* <ClientFilter clients={clients} setClients={setClients} /> */}
                    </Box>
                }
            >
                <ModalComponent open={open === 'NEW' || open === 'EDIT' || open === 'VIEW'} onClose={() => reset(setOpen)}>
                    <Typography variant="h6" marginBottom={1}>
                        {open === 'NEW' && 'Nuevo cliente'}
                        {open === 'EDIT' && 'Editar cliente'}
                        {open === 'VIEW' && `Cliente ${formData.first_name} ${formData.last_name}`}
                    </Typography>
                    <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, validate, formData, reset, setDisabled)}>
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
                                        disabled={open === 'VIEW'}
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
                                        disabled={open === 'VIEW'}
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
                                            disabled={open === 'VIEW'}
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
                                    {errors.cell_phone?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El celular es requerido.
                                        </Typography>
                                    }
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
                                    {errors.work_place?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El nombre del comercio es requerido.
                                        </Typography>
                                    }
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
                                        id="user_id"
                                        value={formData.user_id}
                                        label="Vendedor"
                                        name="user_id"
                                        onChange={handleChange}
                                        disabled={open === 'VIEW'}
                                    >
                                        {sellers.map(s => (
                                            <MenuItem key={s.id} value={s.id}>{`${s.first_name} ${s.last_name}`}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.user_id?.type === 'required' &&
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
                <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)} reduceWidth={900}>
                    <Typography variant="h6" marginBottom={1} textAlign="center">
                        Confirmar eliminación de cliente
                    </Typography>
                    <Typography variant="body1" marginBottom={2} textAlign="center">
                        Los datos no podrán recuperarse
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{ width: '35%' }}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            disabled={disabled}
                            sx={{ width: '35%' }}
                            onClick={() => handleDelete(formData)}
                        >
                            Confirmar
                        </Button>
                    </Box>
                </ModalComponent>
            </DataGridWithBackendPagination>
        </Layout >
    )
}