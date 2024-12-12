import { useContext } from "react";
import { Box, Button, FormControl, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { format } from "date-fns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "../hooks/useForm";
import { usePayments } from "../hooks/usePayments";
import { useRegisters } from "../hooks/useRegisters";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";

import { getRegisterTotal, setLocalDate } from "../utils/helpers";

export function Registers() {

    const { auth } = useContext(AuthContext)

    const { registers, loadingRegisters, getRegisters, handleSubmit, handleDelete, open, setOpen } = useRegisters()
    const { payments, loadingPayments } = usePayments()
    const { formData, setFormData, handleChange, disabled, setDisabled, reset } = useForm({
        defaultData: {
            id: '',
            user_id: auth?.user.id,
            created_at: '',
            updated_at: ''
        }
    })

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N°',
            accessor: 'id'
        },
        {
            id: 'created_at',
            numeric: false,
            disablePadding: true,
            label: 'Fecha y hora Apertura',
            accessor: (row) => format(setLocalDate(row.created_at), 'dd/MM/yy HH:mm:ss')
        },
        {
            id: 'open_amount',
            numeric: false,
            disablePadding: true,
            label: 'Saldo Apertura',
            sorter: () => 0.00,
            accessor: () => '$0.00'
        },
        {
            id: 'close_date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha y hora Cierre',
            sorter: (row) => row.is_open ? '-' : row.updated_at,
            accessor: (row) => row.is_open ? '-' : format(setLocalDate(row.updated_at), 'dd/MM/yy HH:mm:ss')
        },
        {
            id: 'close_amount',
            numeric: false,
            disablePadding: true,
            label: 'Saldo Cierre',
            sorter: (row) => parseFloat(getRegisterTotal(row, payments).replace('$', '')),
            accessor: (row) => getRegisterTotal(row, payments)
        },
        {
            id: 'seller',
            numeric: false,
            disablePadding: true,
            label: 'Vendedor',
            sorter: (row) => row.user.username.toLowerCase(),
            accessor: (row) => row.user.username
        }
    ]

    return (
        <Layout title="Cajas">
            {loadingRegisters || loadingPayments || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    title=""
                    headCells={headCells}
                    rows={registers}
                    open={open}
                    setOpen={setOpen}
                    data={formData}
                    setData={setFormData}
                    handleDelete={handleDelete}
                    handlePrint
                    pageKey="registers"
                    getter={getRegisters}
                    closeRegister
                >
                    <ModalComponent open={open === 'NEW' || open === 'CLOSE-REGISTER'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            {open === 'NEW' && 'Abrir caja'}
                            {open === 'CLOSE-REGISTER' && 'Cerrar caja'}
                        </Typography>
                        <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, formData, reset, setDisabled, setOpen)}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Typography variant="h6" sx={{ marginBottom: 3, textAlign: 'center' }}>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">Fecha</TableCell>
                                                    <TableCell align="center">Hora</TableCell>
                                                    <TableCell align="center">Saldo </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    {open === 'NEW' &&
                                                        <>
                                                            <TableCell align="center">
                                                                {format(setLocalDate(Date.now()), 'dd-MM-yyyy')}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {format(setLocalDate(Date.now()), 'HH:mm:ss')}
                                                            </TableCell>
                                                            <TableCell align="center">$0.00</TableCell>
                                                        </>
                                                    }
                                                    {open === 'CLOSE-REGISTER' &&
                                                        <>
                                                            <TableCell align="center">
                                                                {format(new Date(Date.now()), 'dd-MM-yyyy')}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {format(setLocalDate(Date.now()), 'HH:mm:ss')}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {getRegisterTotal(formData, payments, true)}
                                                            </TableCell>
                                                        </>
                                                    }
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Typography>
                                <FormControl sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    marginTop: 1,
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
                            </Box>
                        </form>
                    </ModalComponent>
                    <ModalComponent open={open === 'EDIT'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            {`Editar caja #${formData.id}`}
                        </Typography>
                        <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, formData, reset, setDisabled, setOpen)}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                        <DateTimePicker
                                            label="Apertura"
                                            value={formData.created_at.length === 0 ? new Date(Date.now()) : new Date(formData.created_at)}
                                            name="created_at"
                                            onChange={value => handleChange({ target: { name: 'created_at', value: new Date(value) } })}
                                            renderInput={(params) => <TextField {...params} />}
                                            disabled={auth.user.role.name !== 'ADMINISTRADOR'}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                                {!formData.is_open &&
                                    <FormControl>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                            <DateTimePicker
                                                label="Cierre"
                                                value={formData.updated_at.length === 0 ? new Date(Date.now()) : new Date(formData.updated_at)}
                                                name="updated_at"
                                                onChange={value => handleChange({ target: { name: 'updated_at', value: new Date(value) } })}
                                                renderInput={(params) => <TextField {...params} />}
                                                disabled={auth.user.role.name !== 'ADMINISTRADOR'}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                }
                                <FormControl sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    marginTop: 1,
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
                            </Box>
                        </form>
                    </ModalComponent>
                </DataGrid>
            }
        </Layout>
    )
}