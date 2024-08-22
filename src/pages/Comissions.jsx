import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';
import { Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { format } from "date-fns";
import CloseIcon from "@mui/icons-material/Close";


import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useUsers } from "../hooks/useUsers";
import { useCommissions } from "../hooks/useCommissions";
import { useSales } from "../hooks/useSales";

import { Layout } from "../components/common/Layout";
import { DataGridWithFrontendPagination } from "../components/datagrid/DataGridWithFrontendPagination";
import { ModalComponent } from "../components/common/ModalComponent";

export function Comissions() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const navigate = useNavigate()

    const {
        getCommissions,
        commissions,
        loadingCommissions,
        open,
        setOpen,
        newCommissionValue,
        setNewCommissionValue,
        handleSubmit,
        handleDelete,
        setCommissions,
        handleCloseCommissions
    } = useCommissions()
    const { getSales } = useSales()
    const { getUsers } = useUsers()
    const { formData, handleChange } = useForm({
        defaultData: {
            from: new Date(Date.now()),
            to: new Date(Date.now()),
            user: auth?.user.role !== 'ADMINISTRADOR' ? auth?.user.name : ''
        }
    });

    useEffect(() => {
        if (auth?.user.role !== 'ADMINISTRADOR' && auth?.user.role !== 'VENDEDOR') {
            navigate('/prep-ventas')
        } else {
            getUsers()
        }
    }, [])

    useEffect(() => {
        const { user, to } = formData
        const username = state.users.data.find(u => u.id === parseInt(user))?.username
        if (user.toString().length > 0 && username) {
            getCommissions(user)
            getSales(`?&to=${new Date(to).toISOString()}&user=${username}`)
        }else{
            setCommissions([])
        }
    }, [formData, state.users.data])

    const commissionsHeadCells = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: '#',
            accessor: 'id'
        },
        {
            id: 'value',
            numeric: false,
            disablePadding: true,
            label: 'Valor',
            accessor: (row) => `${row.value}%`
        },
        {
            id: 'created_at',
            numeric: false,
            disablePadding: true,
            label: 'Fecha act.',
            accessor: (row) => format(new Date(row.created_at), 'dd/MM/yyyy')
        },
        {
            id: 'destroy',
            numeric: false,
            disablePadding: true,
            label: 'Eliminar',
            accessor: (row) => (
                <IconButton
                    className="rounded-full bg-black/20 opacity-50 hover:bg-[#288bcd]"
                    aria-label="delete"
                >
                    <CloseIcon className="w-4 h-4 hover:text-white" />
                </IconButton>
            )
        }
    ]

    const salesHeadCells = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: 'N° bol.',
            accessor: 'id'
        },
        {
            id: 'client',
            numeric: false,
            disablePadding: true,
            label: 'Cliente',
            accessor: (row) => (
                <Box>
                    <Typography variant="body2">{row.client.first_name} {row.client.last_name}</Typography>
                    <Typography variant="body2">{row.client.work_place}</Typography>
                </Box>
            )
        },
        {
            id: 'amount',
            numeric: false,
            disablePadding: true,
            label: 'Monto',
            accessor: (row) => 'asdasd'
        }
    ]

    return (
        <Layout title="Comisiones">
            <Box className="w-[100%]" sx={{ backgroundColor: '#fff' }}>
                <Typography
                    variant="h6"
                    sx={{
                        width: "100%",
                        fontSize: "14px",
                        color: "white",
                        paddingX: "10px",
                        paddingY: "5px",
                        backgroundColor: "#078BCD",
                        borderRadius: "2px",
                        fontWeight: "bold",
                    }}
                >
                    Filtros
                </Typography>
                <form className="mb-3">
                    <Box sx={{ display: "flex", alignItems: "end", justifyContent: "start", gap: 2, padding: 2 }}>
                        <FormControl variant="standard" sx={{ width: "16.5%", color: "#59656b" }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Fecha Inicio"
                                    value={new Date(formData.from)}
                                    onChange={value => handleChange({
                                        target: {
                                            name: 'from',
                                            value: new Date(value.toISOString())
                                        }
                                    })}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl variant="standard" sx={{ width: "16.5%", color: "#59656b" }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Fecha Fin"
                                    value={new Date(formData.to)}
                                    onChange={value => handleChange({
                                        target: {
                                            name: 'to',
                                            value: new Date(value.toISOString())
                                        }
                                    })}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl
                            variant="standard"
                            sx={{
                                width: "20%",
                                color: "#59656b",
                                display: "flex",
                                alignItems: "start",
                                justifyContent: "center"
                            }}
                        >
                            <InputLabel>Vendedor</InputLabel>
                            <Select
                                labelId="seller-select"
                                id="user"
                                value={auth?.user.role === 'ADMINISTRADOR' ? formData.user : auth?.user.id}
                                disabled={auth?.user.role !== 'ADMINISTRADOR'}
                                label="Vendedor"
                                name="user"
                                onChange={handleChange}
                                sx={{ width: "100%" }}
                            >
                                {auth?.user.role === 'ADMINISTRADOR' ? (
                                    [
                                        <MenuItem value="" key="select">Seleccione</MenuItem>,
                                        ...(state.users.data.filter(u => u.role === 'VENDEDOR').length > 0
                                            ? state.users.data.filter(u => u.role === 'VENDEDOR').map((u) => (
                                                <MenuItem key={u.id} value={u.id}>
                                                    {`${u.name}`.toUpperCase()}
                                                </MenuItem>
                                            ))
                                            : [<MenuItem key="no-results">No se encontraron resultados</MenuItem>])
                                    ]
                                ) : (
                                    <MenuItem value={auth?.user.id} key={auth?.user.id}>
                                        {`${auth?.user.name}`.toUpperCase()}
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                </form>
            </Box>
            <Box className="w-[100%]">
                <Typography
                    variant="h6"
                    sx={{
                        width: "100%",
                        fontSize: "14px",
                        color: "white",
                        paddingX: "10px",
                        paddingY: "5px",
                        backgroundColor: "#078BCD",
                        borderRadius: "2px",
                        fontWeight: "bold",
                    }}
                >
                    Valores
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'start', my: 1, mt: 2 }}>
                    <Button
                        type="button"
                        variant="contained"
                        onClick={() => setOpen('HISTORIC')}
                        disabled={formData.user.toString().length === 0}
                    >
                        Ver histórico
                    </Button>
                    <FormControl sx={{ width: '10%' }}>
                        <InputLabel htmlFor="current">Actual</InputLabel>
                        <Input
                            type="text"
                            value={`${commissions[0]?.value ?? 0}%`}
                            disabled
                        />
                    </FormControl>
                </Box>
            </Box>
            <ModalComponent open={open === 'HISTORIC'} onClose={handleCloseCommissions}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        {`Historial de comisiones - ${commissions[0]?.user?.name ?? ''}`}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <FormControl>
                            <InputLabel htmlFor="current">Actualizar valor</InputLabel>
                            <Input
                                type="number"
                                id="value"
                                name="value"
                                value={newCommissionValue}
                                onChange={e => setNewCommissionValue(Math.abs(e.target.value))}
                            />
                        </FormControl>
                        <Button
                            variant="outlined"
                            disabled={newCommissionValue <= 0}
                            onClick={(e) => handleSubmit(e, { user_id: formData.user, value: newCommissionValue })}
                        >
                            Agregar
                        </Button>
                    </Box>
                </Box>
                <DataGridWithFrontendPagination
                    headCells={commissionsHeadCells}
                    rows={commissions}
                />
                <Button variant="outlined" onClick={handleCloseCommissions} sx={{ float: 'right' }}>
                    Cerrar
                </Button>
            </ModalComponent>
        </Layout>
    )
}