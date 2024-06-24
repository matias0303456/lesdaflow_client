import { useContext } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { ClientFilter } from "../components/filters/ClientFilter";

import { REPORT_URL } from "../utils/urls";

export function Clients() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const { loadingClients, handleSubmit, handleDelete, open, setOpen, getClients, toggleBlocked } = useClients()
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
            work_place: '',
            user_id: '',
            is_blocked: false
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
            email: {
                maxLength: 255
            }
        }
    })

    const headCells = [
        {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: "Cliente",
            sorter: (row) => `${row.first_name} ${row.last_name}`,
            accessor: (row) => `${row.first_name} ${row.last_name}`
        },
        {
            id: "document_number",
            numeric: false,
            disablePadding: true,
            label: "Doc./CUIT",
            sorter: (row) => row.document_number ? row.document_number.toString() : '',
            accessor: "document_number"
        },
        {
            id: "cell_phone",
            numeric: false,
            disablePadding: true,
            label: "Celular",
            sorter: (row) => row.cell_phone.toString(),
            accessor: "cell_phone"
        },
        {
            id: "email",
            numeric: false,
            disablePadding: true,
            label: "Email",
            sorter: (row) => row.email ?? '',
            accessor: "email"
        },
        {
            id: "address",
            numeric: false,
            disablePadding: true,
            label: "Dirección",
            sorter: (row) => row.address,
            accessor: (row) => (
                <Link target="_blank" to={`https://www.google.com/maps?q=${row.address}`}>
                    <span style={{ color: '#078BCD' }}>{row.address}</span>
                </Link>
            )
        },
        {
            id: 'work_place',
            numeric: false,
            disablePadding: true,
            label: 'Comercio',
            sorter: (row) => row.work_place,
            accessor: 'work_place'
        },
        {
            id: 'is_blocked',
            numeric: false,
            disablePadding: true,
            label: 'Bloqueado',
            sorter: (row) => row.is_blocked ? 1 : 0,
            accessor: (row) => (
                <Box sx={{ textAlign: 'center' }}>
                    <FormControlLabel
                        control={<Checkbox disabled={auth?.user.role !== 'ADMINISTRADOR'} />}
                        checked={row.is_blocked}
                        onChange={e => toggleBlocked({
                            ...row,
                            is_blocked: e.target.checked
                        })}
                    />
                </Box>
            )
        }
    ];

    return (
        <Layout title="Clientes">
            <DataGridWithBackendPagination
                headCells={auth?.user.role !== 'ADMINISTRADOR' ?
                    headCells :
                    [
                        ...headCells,
                        {
                            id: "seller",
                            numeric: false,
                            disablePadding: true,
                            label: "Vendedor",
                            sorter: (row) => row.user.name,
                            accessor: (row) => row.user.name
                        }
                    ]
                }
                loading={loadingClients || disabled}
                rows={state.clients.data}
                entityKey="clients"
                getter={getClients}
                setOpen={setOpen}
                setFormData={setFormData}
                showEditAction
                showDeleteAction
                showViewAction
                contentHeader={
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="outlined" onClick={() => setOpen('NEW')}>
                                Agregar
                            </Button>
                            <Button variant="outlined" color='error' onClick={() => {
                                window.open(`${REPORT_URL}/client-details/${auth?.token}`, '_blank')
                            }}>
                                PDF
                            </Button>
                        </Box>
                        <ClientFilter />
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
                                    {errors.email?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El email es deamsiado largo.
                                        </Typography>
                                    }
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
        </Layout>
    )
}