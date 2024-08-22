import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useUsers } from "../hooks/useUsers";
import { useCommissions } from "../hooks/useCommissions";
import { useSales } from "../hooks/useSales";

import { Layout } from "../components/common/Layout";
import { DataGridWithFrontendPagination } from "../components/datagrid/DataGridWithFrontendPagination";
import { ModalComponent } from "../components/common/ModalComponent";

import { getSaleTotal } from "../utils/helpers";

export function Comissions() {

    const { auth } = useContext(AuthContext)
    const { state, dispatch } = useContext(DataContext)

    const navigate = useNavigate()

    const {
        getCommissions,
        commissions,
        open,
        setOpen,
        newCommissionValue,
        setNewCommissionValue,
        handleSubmit,
        setCommissions,
        handleCloseCommissions,
        newCommissionDate,
        setNewCommissionDate,
        newCommissionType,
        setNewCommissionType
    } = useCommissions()
    const { getSales } = useSales()
    const { getUsers, loadingUsers } = useUsers()
    const { formData, handleChange } = useForm({
        defaultData: {
            from: new Date(Date.now()),
            to: new Date(Date.now()),
            user: auth?.user.role !== 'ADMINISTRADOR' ? auth?.user.name : ''
        }
    });

    const [loadingTables, setLoadingTables] = useState(false)

    useEffect(() => {
        dispatch({ type: 'SALES', payload: { ...state.sales, data: [], count: 0 } })
        if (auth?.user.role !== 'ADMINISTRADOR' && auth?.user.role !== 'VENDEDOR') {
            navigate('/prep-ventas')
        } else {
            getUsers()
        }
    }, [])

    useEffect(() => {
        (async () => {
            setLoadingTables(true)
            const { user, to } = formData
            const user_id = auth?.user.role === 'ADMINISTRADOR' ? user : auth?.user.id
            const username = auth?.user.role === 'ADMINISTRADOR' ?
                state.users.data.find(u => u.id === parseInt(user))?.username :
                auth?.user.username
            if (user.toString().length > 0 && username) {
                await getCommissions(user_id)
                await getSales(`?to=${new Date(to).toISOString()}${auth?.user.role === 'ADMINISTRADOR' ? `&user=${username}` : ''}`)
                setLoadingTables(false)
            } else {
                setCommissions([])
                setLoadingTables(false)
            }
        })()
    }, [formData, state.users.data])

    const commissionsHeadCells = [
        {
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha corte',
            accessor: (row) => format(new Date(row.date), 'dd/MM/yyyy')
        },
        {
            id: 'value',
            numeric: false,
            disablePadding: true,
            label: 'Valor',
            accessor: (row) => `${row.value}%`
        },
    ]

    const salesHeadCells = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: 'Bol.',
            accessor: 'id'
        },
        {
            id: 'client',
            numeric: false,
            disablePadding: true,
            label: 'Cliente',
            accessor: (row) => (
                <Box>
                    <Typography variant="body1">{row.client.first_name} {row.client.last_name}</Typography>
                    <Typography variant="body2">{row.client.work_place}</Typography>
                </Box>
            )
        },
        {
            id: 'amount',
            numeric: false,
            disablePadding: true,
            label: 'Monto',
            accessor: (row) => getSaleTotal(row)
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
                                    label="Inicio período"
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
                                    label="Fin período"
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
                        <InputLabel>Actual Cta. Cte.</InputLabel>
                        <Input
                            type="text"
                            value={`${commissions.filter(c => {
                                return new Date(c.date) < new Date(Date.now()) && c.type === 'CUENTA_CORRIENTE'
                            })[0]?.value ?? 0}%`}
                            disabled
                        />
                    </FormControl>
                    <FormControl sx={{ width: '10%' }}>
                        <InputLabel>Actual Contado</InputLabel>
                        <Input
                            type="text"
                            value={`${commissions.filter(c => {
                                return new Date(c.date) < new Date(Date.now()) && c.type === 'CONTADO'
                            })[0]?.value ?? 0}%`}
                            disabled
                        />
                    </FormControl>
                    <FormControl sx={{ width: '10%' }}>
                        <InputLabel>Actual Poxipol</InputLabel>
                        <Input
                            type="text"
                            value={`${commissions.filter(c => {
                                return new Date(c.date) < new Date(Date.now()) && c.type === 'POXIPOL'
                            })[0]?.value ?? 0}%`}
                            disabled
                        />
                    </FormControl>
                </Box>
                <ModalComponent open={open === 'HISTORIC'} onClose={handleCloseCommissions}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap' }}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            {`Historial de comisiones - ${commissions[0]?.user?.name ?? ''}`}
                        </Typography>
                        {auth?.user.role === 'ADMINISTRADOR' &&
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'start', justifyContent: 'end' }}>
                                <FormControl sx={{ width: '30%' }}>
                                    <InputLabel htmlFor="current">Nuevo valor</InputLabel>
                                    <Input
                                        type="number"
                                        id="value"
                                        name="value"
                                        value={newCommissionValue}
                                        onChange={e => setNewCommissionValue(Math.abs(e.target.value))}
                                    />
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
                                    <InputLabel>Tipo</InputLabel>
                                    <Select
                                        labelId="type-select"
                                        id="type"
                                        value={newCommissionType}
                                        disabled={newCommissionValue <= 0}
                                        label="Tipo"
                                        name="type"
                                        onChange={(e) => setNewCommissionType(e.target.value)}
                                        sx={{ width: "100%" }}
                                    >
                                        <MenuItem value="CUENTA_CORRIENTE">
                                            CTA CTE
                                        </MenuItem>
                                        <MenuItem value="CONTADO">
                                            CONTADO
                                        </MenuItem>
                                        <MenuItem value="POXIPOL">
                                            POXIPOL
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl variant="standard" sx={{ width: "30%", color: "#59656b" }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                        <DatePicker
                                            label="Fecha de corte"
                                            value={new Date(newCommissionDate)}
                                            disabled={newCommissionValue <= 0}
                                            onChange={value => setNewCommissionDate(new Date(value.toISOString()))}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                                <Button
                                    variant="outlined"
                                    sx={{ width: '20%' }}
                                    disabled={newCommissionValue <= 0}
                                    onClick={(e) => handleSubmit(e, {
                                        user_id: formData.user,
                                        value: newCommissionValue,
                                        date: newCommissionDate,
                                        type: newCommissionType
                                    })}
                                >
                                    Agregar
                                </Button>
                            </Box>
                        }
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', my: 2 }}>
                        <Box sx={{ width: { xs: '100%', lg: '30%' } }}>
                            <Typography>CUENTA CORRIENTE</Typography>
                            <DataGridWithFrontendPagination
                                headCells={commissionsHeadCells}
                                rows={commissions.filter(c => c.type === 'CUENTA_CORRIENTE')}
                                defaultOrderBy="date"
                                minWidth={0}
                            />
                        </Box>
                        <Box sx={{ width: { xs: '100%', lg: '30%' } }}>
                            <Typography>CONTADO</Typography>
                            <DataGridWithFrontendPagination
                                headCells={commissionsHeadCells}
                                rows={commissions.filter(c => c.type === 'CONTADO')}
                                defaultOrderBy="date"
                                minWidth={0}
                            />
                        </Box>
                        <Box sx={{ width: { xs: '100%', lg: '30%' } }}>
                            <Typography>POXIPOL</Typography>
                            <DataGridWithFrontendPagination
                                headCells={commissionsHeadCells}
                                rows={commissions.filter(c => c.type === 'POXIPOL')}
                                defaultOrderBy="date"
                                minWidth={0}
                            />
                        </Box>
                    </Box>
                    <Button variant="outlined" onClick={handleCloseCommissions} sx={{ float: 'right' }}>
                        Cerrar
                    </Button>
                </ModalComponent>
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
                    Boletas
                </Typography>
                {loadingUsers || loadingTables ?
                    <Box sx={{ width: '100%', p: 5 }}>
                        <LinearProgress />
                    </Box> :
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'start',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        mt: 1,
                        gap: { xs: 1, lg: 3 }
                    }}>
                        <Box sx={{ width: { xs: '100%', lg: '30%' } }}>
                            <Typography variant="h6">
                                Cuentas corrientes
                            </Typography>
                            <DataGridWithFrontendPagination
                                headCells={salesHeadCells}
                                rows={state.sales.data.filter(s => s.type === 'CUENTA_CORRIENTE')}
                                minWidth={0}
                            />
                        </Box>
                        <Box sx={{ width: { xs: '100%', lg: '30%' } }}>
                            <Typography variant="h6">
                                Contado
                            </Typography>
                            <DataGridWithFrontendPagination
                                headCells={salesHeadCells}
                                rows={state.sales.data.filter(s => s.type === 'CONTADO')}
                                minWidth={0}
                            />
                        </Box>
                        <Box sx={{ width: { xs: '100%', lg: '30%' } }}>
                            <Typography variant="h6">
                                Poxipol
                            </Typography>
                            <DataGridWithFrontendPagination
                                headCells={salesHeadCells}
                                rows={state.sales.data.filter(s => s.type === 'POXIPOL')}
                                minWidth={0}
                            />
                        </Box>
                    </Box>
                }
            </Box>
        </Layout>
    )
}