import { useContext, useEffect } from "react";
import { Box, Button, FormControl, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useRegisters } from "../hooks/useRegisters";
import { useUsers } from "../hooks/useUsers";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { RegisterFilter } from "../components/filters/RegisterFilter";

import { setLocalDate } from "../utils/helpers";
import { REPORT_URL } from "../utils/urls";

export function Registers() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const { loadingRegisters, handleSubmit, open, setOpen, getRegisters, currentAmount, getCurrentRegister } = useRegisters()
    const { getUsers } = useUsers()
    const { formData, setFormData, handleChange, disabled, setDisabled, reset } = useForm({
        defaultData: { id: '', user_id: auth?.user.id }
    })

    useEffect(() => {
        getUsers()
    }, [])

    useEffect(() => {
        if (open === 'SETTINGS') {
            getCurrentRegister(formData)
        }
    }, [open, formData])

    const headCells = [
        {
            id: "user",
            numeric: false,
            disablePadding: true,
            label: "Caja",
            sorter: (row) => row.user.username,
            accessor: (row) => row.user.username,
        },
        {
            id: "open_date",
            numeric: false,
            disablePadding: true,
            label: "Apertura Fecha",
            sorter: (row) => format(setLocalDate(row.created_at), 'dd/MM/yy'),
            accessor: (row) => format(setLocalDate(row.created_at), 'dd/MM/yy')
        },
        {
            id: "open_hour",
            numeric: false,
            disablePadding: true,
            label: "Apertura Hora",
            sorter: (row) => format(new Date(row.created_at), 'HH:mm:ss').toString().replace(':', ''),
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
            sorter: (row) => row.created_at === row.updated_at ? '-' : format(setLocalDate(row.updated_at), 'dd/MM/yy'),
            accessor: (row) => row.created_at === row.updated_at ? '-' : format(setLocalDate(row.updated_at), 'dd/MM/yy')
        },
        {
            id: "end_hour",
            numeric: false,
            disablePadding: true,
            label: "Cierre hora",
            sorter: (row) => row.created_at === row.updated_at ? '-' : format(new Date(row.updated_at), 'HH:mm:ss').toString().replace(':', ''),
            accessor: (row) => row.created_at === row.updated_at ? '-' : format(setLocalDate(row.updated_at), 'HH:mm:ss')
        },
        {
            id: "end_amount",
            numeric: false,
            disablePadding: true,
            label: "Cierre Saldo",
            sorter: (row) => parseFloat(row.end_amount.replace('$', '')),
            accessor: (row) => row.end_amount
        }
    ];

    return (
        <Layout title="Movimientos Caja">
            <DataGridWithBackendPagination
                loading={loadingRegisters || disabled}
                headCells={headCells}
                rows={state.registers.data}
                entityKey="registers"
                getter={getRegisters}
                setOpen={setOpen}
                setFormData={setFormData}
                showSettingsAction="Cerrar caja"
                showPDFAction={`${REPORT_URL}/register-details?token=${auth?.token}&id=`}
                showViewAction
                contentHeader={
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
                        <Button variant="outlined" onClick={() => {
                            reset()
                            setOpen('NEW')
                        }}>
                            Apertura caja
                        </Button>
                        {auth?.user.role === 'ADMINISTRADOR' && <RegisterFilter />}
                    </Box>
                }
            >
                <ModalComponent open={open === 'NEW' || open === 'SETTINGS' || open === 'VIEW'} onClose={() => reset(setOpen)}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        {open === 'NEW' && 'Apertura de caja'}
                        {open === 'VIEW' && `Caja ${formData.user.name}`}
                        {open === 'SETTINGS' && 'Cerrar caja'}
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
                                                {(open === 'SETTINGS' || open === 'VIEW') &&
                                                    <>
                                                        <TableCell align="center">
                                                            {format(setLocalDate(formData.created_at), 'dd-MM-yyyy')}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {format(setLocalDate(Date.now()), 'HH:mm:ss')}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {formData.end_amount ?? currentAmount}
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
                                    {open === 'VIEW' && 'Cerrar'}
                                    {(open === 'SETTINGS' || open === 'NEW') && 'Cancelar'}
                                </Button>
                                {(open === 'NEW' || open === 'SETTINGS') &&
                                    < Button type="submit" variant="contained" disabled={disabled} sx={{
                                        width: '50%'
                                    }}>
                                        Confirmar
                                    </Button>
                                }
                            </FormControl>
                        </Box>
                    </form>
                </ModalComponent>
            </DataGridWithBackendPagination>
        </Layout >
    )
}