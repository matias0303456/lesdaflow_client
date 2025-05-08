import { useContext, useEffect } from "react";
import { Box, Button, FormControl, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { format } from "date-fns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
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

    const { getUsers } = useUsers()
    const {
        loadingRegisters,
        handleSubmit,
        open,
        setOpen,
        getRegisters,
        currentAmount,
        getCurrentRegister,
        registerFormData,
        headCells
    } = useRegisters()
    const { formData, setFormData, handleChange, disabled, setDisabled, reset } = registerFormData

    useEffect(() => {
        getUsers()
    }, [])

    useEffect(() => {
        const { page, offset } = state['registers']
        getRegisters(`?page=${page}&offset=${offset}`)
    }, [state['registers'].filters])

    useEffect(() => {
        if (open === 'SETTINGS') {
            getCurrentRegister(formData)
        }
    }, [open, formData])

    return (
        <Layout title="Movimientos Caja">
            <DataGridWithBackendPagination
                loading={loadingRegisters || disabled}
                headCells={headCells}
                rows={state.registers.data}
                entityKey="registers"
                setOpen={setOpen}
                setFormData={setFormData}
                showSettingsAction="Cerrar caja"
                showEditAction={auth.user.role === 'ADMINISTRADOR'}
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
                <ModalComponent open={open === 'EDIT'} onClose={() => reset(setOpen)} reduceWidth={900}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        {open === 'EDIT' && `Editar caja #${formData.id}`}
                    </Typography>
                    <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, formData, reset, setDisabled, setOpen)}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            width: { xs: '100%', md: '50%' },
                            m: 'auto'
                        }}
                        >
                            <FormControl>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                    <DateTimePicker
                                        label="Apertura"
                                        value={new Date(formData.created_at)}
                                        onChange={value => handleChange({
                                            target: {
                                                name: 'created_at',
                                                value: new Date(value.toISOString())
                                            }
                                        })}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                            {!formData.is_open &&
                                <FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                        <DateTimePicker
                                            label="Cierre"
                                            value={new Date(formData.updated_at)}
                                            onChange={value => handleChange({
                                                target: {
                                                    name: 'updated_at',
                                                    value: new Date(value.toISOString())
                                                }
                                            })}
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
                                marginTop: 1
                            }}>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={() => reset(setOpen)}
                                    sx={{ width: '50%' }}
                                >
                                    Cancelar
                                </Button>
                                < Button
                                    type="submit"
                                    variant="contained"
                                    disabled={disabled}
                                    sx={{ width: '50%' }}
                                >
                                    Guardar
                                </Button>
                            </FormControl>
                        </Box>
                    </form>
                </ModalComponent>
            </DataGridWithBackendPagination>
        </Layout >
    )
}