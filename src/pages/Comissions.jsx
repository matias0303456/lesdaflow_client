import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';
import { Box, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { format } from "date-fns";


import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";

import { Layout } from "../components/common/Layout";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";

import { usePayments } from "../hooks/usePayments";
import { useUsers } from "../hooks/useUsers";
import { ModalComponent } from "../components/common/ModalComponent";
import { PaymentFilter } from "../components/filters/PaymentFilter";

export function Comissions() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const navigate = useNavigate()

    const { formData, handleChange } = useForm({
        defaultData: {
            from: new Date(Date.now()),
            to: new Date(Date.now()),
            user: auth?.user.role !== 'ADMINISTRADOR' ? auth?.user.username : '',
            code: ''
        }
    });

    useEffect(() => {
        if (auth?.user.role !== 'ADMINISTRADOR' && auth?.user.role !== 'VENDEDOR') {
            navigate('/prep-ventas')
        }
    }, [])

    const headCells = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: 'N° bol.',
            accessor: 'id'
        },
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
                <form className="mb-1">
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
                                        ...(state.users.data.filter(u => u.role !== 'CHOFER').length > 0
                                            ? state.users.data.filter(u => u.role !== 'CHOFER').map((u) => (
                                                <MenuItem key={u.id} value={u.username}>
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
                    Valores en %
                </Typography>
            </Box>
        </Layout>
    )
}