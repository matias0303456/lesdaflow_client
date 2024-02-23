import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { usePayments } from "../hooks/usePayments";
import { useRegisters } from "../hooks/useRegisters";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";
import { SupplierFilter } from "../components/filters/SupplierFilter";

import { REGISTER_URL } from "../utils/urls";
import { getNewPrice, getRegisterTotal, setLocalDate } from "../utils/helpers";

export function Registers() {

    const { auth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const navigate = useNavigate()

    const { post, put, destroy } = useApi(REGISTER_URL)
    const { registers, setRegisters, loadingRegisters, setLoadingRegisters } = useRegisters()
    const { payments, loadingPayments } = usePayments()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            user_id: auth.user.id
        }
    })

    const [open, setOpen] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
        if (status === 200) {
            if (open === 'NEW') {
                setRegisters([data, ...registers])
                setMessage('Caja abierta correctamente.')
            } else {
                setRegisters([data, ...registers.filter(r => r.id !== formData.id)])
                setMessage('Caja cerrada correctamente.')
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

    async function handleDelete(elements) {
        setLoadingRegisters(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setRegisters([...registers.filter(r => !ids.includes(r.id))])
            setMessage(`${result.length === 1 ? 'Caja eliminada' : 'Cajas eliminadas'} correctamente.`)
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingRegisters(false)
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
            id: 'open_date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha y hora Apertura',
            accessor: (row) => format(setLocalDate(row.created_at), 'dd-MM-yyyy HH:mm:ss')
        },
        {
            id: 'open_amount',
            numeric: false,
            disablePadding: true,
            label: 'Saldo Apertura',
            accessor: () => '$0.00'
        },
        {
            id: 'close_date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha y hora Cierre',
            accessor: (row) => row.created_at === row.updated_at ? '-' : format(setLocalDate(row.updated_at), 'dd-MM-yyyy HH:mm:ss')
        },
        {
            id: 'close_amount',
            numeric: false,
            disablePadding: true,
            label: 'Saldo Cierre',
            accessor: (row) => getRegisterTotal(row, payments)
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
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            {open === 'NEW' && 'Abrir caja'}
                            {open === 'EDIT' && 'Cerrar caja'}
                        </Typography>
                        <form onChange={handleChange} onSubmit={handleSubmit}>
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
                                                    {open === 'EDIT' &&
                                                        <>
                                                            <TableCell align="center">
                                                                {format(setLocalDate(formData.created_at), 'dd-MM-yyyy')}
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
                </DataGrid>
            }
        </Layout>
    )
}