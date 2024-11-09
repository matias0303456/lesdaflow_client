/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

import { FreeLoanPaymentsAbm } from "./FreeLoanPaymentsAbm";

import { PAYMENT_FREQUENCIES } from "../../utils/constants";
import { getLoanTotal, getPaymentAmount } from "../../utils/helpers";

export function LoanForm({
    open,
    handleChange,
    handleSubmit,
    clients,
    formData,
    setFormData,
    errors,
    validate,
    reset,
    disabled,
    setDisabled,
    handleClose,
    handleDeleteFreeLoanPaymentDate
}) {

    const [payments, setPayments] = useState([])

    useEffect(() => {
        if (open === 'EDIT' && formData.payments_frequency === PAYMENT_FREQUENCIES[3]) {
            setPayments(formData.free_loan_payment_dates)
        }
    }, [open])

    useEffect(() => {
        if (formData.payments_frequency === PAYMENT_FREQUENCIES[3]) {
            setFormData({
                ...formData,
                payments_amount: payments.length,
                payment_dates: payments
            })
        }
    }, [payments, formData.payments_frequency])

    return (
        <form onSubmit={e => handleSubmit(e, formData, validate, reset, setDisabled)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: { xs: 2, sm: 1 } }}>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <Autocomplete
                            disablePortal
                            options={clients.map(c => ({ id: c.id, label: `${c.first_name} ${c.last_name}` }))}
                            renderInput={(params) => <TextField {...params} label="Cliente" />}
                            name="client_id"
                            value={formData.client_id?.toString().length > 0 ? `${clients.find(c => c.id === formData.client_id)?.first_name} ${clients.find(c => c.id === formData.client_id)?.last_name}` : ''}
                            onChange={(_, value) => handleChange({ target: { name: 'client_id', value: value?.id ?? '' } })}
                            isOptionEqualToValue={(option, value) => formData.client_id?.toString().length === 0 || value === option.label}
                        />
                        {errors.client_id?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El cliente es requerido.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Fecha"
                                value={new Date(formData.date)}
                                onChange={value => handleChange({
                                    target: {
                                        name: 'date',
                                        value: new Date(value.toISOString())
                                    }
                                })}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <Box sx={{ width: { xs: '100%', sm: '32%' } }}>
                        {PAYMENT_FREQUENCIES.map(pf => (
                            <FormControlLabel
                                key={pf}
                                control={<Checkbox />}
                                disabled={open === 'EDIT'}
                                label={pf}
                                checked={formData.payments_frequency === pf}
                                onChange={() => setFormData({ ...formData, payments_frequency: pf })}
                            />
                        ))}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: { xs: 2, sm: 1 } }}>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <TextField
                            type="number"
                            label="Monto"
                            variant="outlined"
                            id="amount"
                            name="amount"
                            disabled={open === 'EDIT' && (!formData.payments || formData.payments.length > 0)}
                            InputProps={{ inputProps: { step: 0.01 } }}
                            value={formData.amount}
                            onChange={e => handleChange({
                                target: {
                                    name: 'amount',
                                    value: Math.abs(parseFloat(e.target.value))
                                }
                            })}
                        />
                        {errors.amount?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El monto es requerido.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <TextField
                            type="number"
                            label="Interés"
                            variant="outlined"
                            id="interest"
                            name="interest"
                            disabled={open === 'EDIT' && (!formData.payments || formData.payments.length > 0)}
                            InputProps={{ inputProps: { step: 0.01 } }}
                            value={formData.interest}
                            onChange={e => handleChange({
                                target: {
                                    name: 'interest',
                                    value: Math.abs(parseFloat(e.target.value))
                                }
                            })}
                        />
                        {errors.interest?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El interés es requerido.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <TextField
                            type="number"
                            label="Cant. pagos"
                            variant="outlined"
                            id="payments_amount"
                            name="payments_amount"
                            InputProps={{ inputProps: { step: 1, min: 1 } }}
                            value={formData.payments_amount}
                            disabled={(open === 'EDIT' && (!formData.payments || formData.payments.length > 0)) || formData.payments_frequency === PAYMENT_FREQUENCIES[3]}
                            onChange={e => handleChange({
                                target: {
                                    name: 'payments_amount',
                                    value: Math.abs(parseInt(e.target.value))
                                }
                            })}
                        />
                        {errors.payments_amount?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La cantidad de pagos es requerida.
                            </Typography>
                        }
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: { xs: 2, sm: 1 } }}>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <TextField
                            type="number"
                            label="Interés por mora"
                            variant="outlined"
                            id="late_fee"
                            name="late_fee"
                            disabled={open === 'EDIT' && (!formData.payments || formData.payments.length > 0)}
                            InputProps={{ inputProps: { step: 0.01 } }}
                            value={formData.late_fee}
                            onChange={e => handleChange({
                                target: {
                                    name: 'late_fee',
                                    value: Math.abs(parseFloat(e.target.value))
                                }
                            })}
                        />
                        {errors.late_fee?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El interés por mora es requerido.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <TextField
                            type="number"
                            label="Días sin cálculo de mora"
                            variant="outlined"
                            id="no_late_fee_days"
                            name="no_late_fee_days"
                            disabled={open === 'EDIT' && (!formData.payments || formData.payments.length > 0)}
                            InputProps={{ inputProps: { step: 1 } }}
                            value={formData.no_late_fee_days}
                            onChange={e => handleChange({
                                target: {
                                    name: 'no_late_fee_days',
                                    value: Math.abs(parseInt(e.target.value))
                                }
                            })}
                        />
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <InputLabel id="type-select">Tipo cálculo</InputLabel>
                        <Select
                            labelId="type-select"
                            id="type"
                            label="Tipo cálculo"
                            disabled={open === 'EDIT' && (!formData.payments || formData.payments.length > 0)}
                            value={formData.late_fee_type}
                            name="late_fee_type"
                            sx={{ width: '100%' }}
                            onChange={handleChange}
                        >
                            <MenuItem value="NOMINAL">NOMINAL</MenuItem>
                            <MenuItem value="PORCENTUAL">PORCENTUAL</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: { xs: 2, sm: 1 } }}>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <InputLabel id="observations">Observaciones</InputLabel>
                        <Input
                            id="observations"
                            name="observations"
                            value={formData.observations}
                            onChange={handleChange}
                        />
                        {errors.observations?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Las observaciones son demasiado largas.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <InputLabel id="payments_frequency">Monto por cuota</InputLabel>
                        <Input
                            type="text"
                            disabled
                            value={getPaymentAmount(formData)}
                        />
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <InputLabel id="payments_frequency">Total</InputLabel>
                        <Input
                            type="text"
                            disabled
                            value={getLoanTotal(formData)}
                        />
                    </FormControl>
                </Box>
                {formData.payments_frequency === PAYMENT_FREQUENCIES[3] &&
                    <FreeLoanPaymentsAbm
                        payments={payments}
                        setPayments={setPayments}
                        formData={formData}
                        open={open}
                        handleDeleteFreeLoanPaymentDate={handleDeleteFreeLoanPaymentDate}
                    />
                }
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 3 }}>
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={handleClose}
                        sx={{ width: { xs: '50%', sm: '35%' } }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={disabled || (formData.payments_frequency === PAYMENT_FREQUENCIES[3] && payments.length === 0)}
                        sx={{ width: { xs: '50%', sm: '35%' }, color: '#FFF' }}
                    >
                        Confirmar
                    </Button>
                </Box>
            </Box>
        </form>
    )
}