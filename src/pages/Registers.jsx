import { useContext, useState } from "react";
import { Box, Button, FormControl, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { format } from "date-fns";

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

    const { registers, loadingRegisters, handleSubmit, handleDelete, open, setOpen } = useRegisters()
    const { payments, loadingPayments } = usePayments()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            user_id: auth.user.id
        }
    })

    const headCells = [
        {
            id: "user",
            numeric: false,
            disablePadding: true,
            label: "Caja",
            accessor: (row) => `${row.user.first_name} ${row.user.last_name}`,
        },
        {
            id: "open_date",
            numeric: false,
            disablePadding: true,
            label: "Apertura Fecha",
            accessor: (row) => format(setLocalDate(row.created_at), 'dd/MM/yy')
        },
        {
            id: "open_hour",
            numeric: false,
            disablePadding: true,
            label: "Apertura Hora",
            accessor: (row) => format(setLocalDate(row.created_at), 'HH:mm:ss')
        },
        {
            id: "open_amount",
            numeric: false,
            disablePadding: true,
            label: "Apertura Saldo",
            sorter: () => 0.00,
            accessor: () => '$0.00'
        },
        {
            id: "end_date",
            numeric: false,
            disablePadding: true,
            label: "Cierre Fecha",
            sorter: (row) => row.created_at === row.updated_at ? '-' : row.updated_at,
            accessor: (row) => row.created_at === row.updated_at ? '-' : format(setLocalDate(row.updated_at), 'dd/MM/yy')
        },
        {
            id: "end_hour",
            numeric: false,
            disablePadding: true,
            label: "Cierre hora",
            accessor: (row) => row.created_at === row.updated_at ? '-' : format(setLocalDate(row.updated_at), 'HH:mm:ss')
        },
        {
            id: "end_amount",
            numeric: false,
            disablePadding: true,
            label: "Cierre Saldo",
            sorter: (row) => parseFloat(getRegisterTotal(row, payments).replace('$', '')),
            accessor: (row) => getRegisterTotal(row, payments)
        }
    ];

    return (
        <Layout title="Movimientos Caja">
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
                    contentHeader={<Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="outlined" onClick={() => setOpen('NEW')}>
                                Apertura caja
                            </Button>
                            <Button variant="outlined" color='success'>
                                Excel
                            </Button>
                        </Box>
                    </Box>}
                >

                </DataGrid>
            }
        </Layout>
    )
}