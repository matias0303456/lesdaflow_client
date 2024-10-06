/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Tooltip, Typography } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import DeleteIcon from '@mui/icons-material/Delete';

import { getPaymentAmount, getPaymentAmountWithLateFee } from "../../utils/helpers"

export function PaymentForm({
    handleSubmit,
    handleChange,
    validate,
    formData,
    setFormData,
    reset,
    setOpen,
    disabled,
    setDisabled,
    errors,
    workOn,
    loans,
    setLoans,
    open,
    handleDelete
}) {

    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {
        if (open === 'NEW-PAYMENT') {
            const payments = workOn.loan.payments
            const prev_pending = !payments || payments.length === 0 ? 0 : payments[payments.length - 1].pending
            const total = parseFloat(getPaymentAmountWithLateFee(workOn, formData)) + prev_pending
            setFormData({
                ...formData,
                prev_pending,
                total: total.toFixed(2),
                pending: (total - parseFloat(formData.amount.toString().length === 0 ? 0 : formData.amount)).toFixed(2)
            })
        }
    }, [formData.date, formData.amount, workOn.loan, open])

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
                <Typography variant="h6">
                    {open === 'NEW-PAYMENT' && `Nuevo pago - ${format(new Date(workOn.payment), 'dd/MM/yyyy')}`}
                    {open === 'PAYMENT-DETAILS' && `Editar pago - ${format(new Date(workOn.payment), 'dd/MM/yyyy')}`}
                </Typography>
                {open === 'PAYMENT-DETAILS' &&
                    loans.find(l => l.id === workOn.loan.id).payments[loans.find(l => l.id === workOn.loan.id).payments.length - 1]?.id === formData.id &&
                    <Tooltip title="Eliminar pago">
                        <IconButton onClick={() => setConfirmDelete(true)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                }
            </Box>
            <form onSubmit={e => {
                if (confirmDelete) {
                    handleDelete(e, formData, loans, setLoans)
                } else {
                    handleSubmit(e, validate, formData, reset, setDisabled, loans, setLoans)
                }
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    paddingX: 3,
                    m: 'auto',
                    width: { xs: '100%', sm: '70%' }
                }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl sx={{ width: '50%' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Fecha"
                                    value={new Date(formData.date)}
                                    disabled={open === 'PAYMENT-DETAILS' || confirmDelete}
                                    onChange={value => handleChange({
                                        target: {
                                            name: 'date',
                                            value: new Date(value.toISOString())
                                        }
                                    })}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl sx={{ width: '50%' }}>
                            <InputLabel id="type-select">Tipo</InputLabel>
                            <Select
                                labelId="type-select"
                                id="type"
                                value={formData.type}
                                label="Proveedor"
                                name="type"
                                sx={{ width: '100%' }}
                                disabled={confirmDelete}
                                onChange={handleChange}
                            >
                                <MenuItem value="EFECTIVO">EFECTIVO</MenuItem>
                                <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
                                <MenuItem value="CHEQUE">CHEQUE</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                {open === 'NEW-PAYMENT' &&
                                    <>
                                        <TableRow>
                                            <TableCell>Importe neto</TableCell>
                                            <TableCell>{`$${getPaymentAmount(workOn.loan)}`}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Saldo anterior</TableCell>
                                            <TableCell>{`$${formData.prev_pending}`}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Interés por mora</TableCell>
                                            <TableCell>{`${workOn.loan.late_fee}%`}</TableCell>
                                        </TableRow>
                                    </>
                                }
                                <TableRow>
                                    {open === 'NEW-PAYMENT' ?
                                        <>
                                            <TableCell>Total</TableCell>
                                            <TableCell>{`$${formData.total}`}</TableCell>
                                        </> :
                                        <>
                                            <TableCell>Monto</TableCell>
                                            <TableCell>{`$${formData.amount}`}</TableCell>
                                        </>
                                    }
                                </TableRow>
                                {open === 'NEW-PAYMENT' &&
                                    <>
                                        <TableRow>
                                            <TableCell>Paga</TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    variant="outlined"
                                                    id="amount"
                                                    name="amount"
                                                    InputProps={{ inputProps: { step: 0.01 } }}
                                                    value={formData.amount}
                                                    onChange={e => handleChange({
                                                        target: {
                                                            name: 'amount',
                                                            value: Math.abs(parseFloat(e.target.value))
                                                        }
                                                    })}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Saldo pendiente</TableCell>
                                            <TableCell>{`$${formData.pending}`}</TableCell>
                                        </TableRow>
                                    </>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <FormControl>
                        <InputLabel id="observations">Observaciones</InputLabel>
                        <Input
                            id="observations"
                            name="observations"
                            value={formData.observations}
                            disabled={confirmDelete}
                            onChange={handleChange}
                        />
                        {errors.observations?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Las observaciones son demasiado largas.
                            </Typography>
                        }
                    </FormControl>
                </Box>
                {open === 'PAYMENT-DETAILS' && confirmDelete &&
                    <>
                        <Typography variant="h6" color="#F00" align="center" mt={5}>
                            ¿Desea eliminar este pago?
                        </Typography>
                        <Typography variant="body1" color="#F00" align="center">
                            Los datos no podrán recuperarse.
                        </Typography>
                    </>
                }
                <Box sx={{ display: 'flex', justifyContent: 'end', mt: confirmDelete ? 2 : 5 }}>
                    <FormControl sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        justifyContent: 'center',
                        margin: '0 auto',
                        width: { xs: '100%', md: '50%' }
                    }}>
                        <Button
                            type="button"
                            variant="outlined"
                            sx={{ width: '33%' }}
                            onClick={() => {
                                if (confirmDelete) {
                                    setConfirmDelete(false)
                                } else {
                                    reset(setOpen)
                                }
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color={confirmDelete ? "error" : 'primary'}
                            disabled={disabled}
                            sx={{ width: '33%', color: '#FFF' }}
                        >
                            {confirmDelete ? 'Eliminar' : 'Guardar'}
                        </Button>
                    </FormControl>
                </Box>
            </form >
        </>
    )
}