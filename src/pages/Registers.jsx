import { useContext, useState } from "react";
import { Box, Button, FormControl, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
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

import { REGISTER_URL } from "../utils/urls";
import { getRegisterTotal, setLocalDate } from "../utils/helpers";

export function Registers() {

    const { auth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

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
            id: 'cash_register',
            numeric: true,
            disablePadding: false,
            label: 'Caja',
            accessor: 'cash_register'
        },
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
                    contentHeader={ <Box sx={{
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
                        {/* <SaleFilter sales={sales} setSales={setSales} /> */}
                    </Box>}
                >
                    
                </DataGrid>
            }
        </Layout>
    )
}