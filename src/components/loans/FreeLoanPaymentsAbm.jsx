/* eslint-disable react/prop-types */
import { Box, Button, Chip, FormControl, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { format } from "date-fns";
import { es } from "date-fns/locale"
import { useState } from "react";

export function FreeLoanPaymentsAbm({
    payments,
    setPayments,
    formData,
    open,
    handleDeleteFreeLoanPaymentDate
}) {

    const [value, setValue] = useState(new Date(Date.now()))

    return (
        <Box>
            <Typography variant="h6">
                Fechas de pago
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, marginTop: 1, marginBottom: 1 }}>
                <FormControl sx={{ width: '30%' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Fecha"
                            value={value}
                            disabled={formData.payments?.length > 0}
                            onChange={value => setValue(new Date(value.toISOString()))}
                        />
                    </LocalizationProvider>
                </FormControl>
                <Button
                    type="button"
                    variant="outlined"
                    onClick={() => {
                        if (payments.length === 0 || payments.every(p => {
                            return new Date(p.date).getDay() !== new Date(value).getDay() ||
                                new Date(p.date).getMonth() !== new Date(value).getMonth() ||
                                new Date(p.date).getFullYear() !== new Date(value).getFullYear()
                        })) setPayments([...payments, { idx: payments.length, date: value }])
                    }}
                >
                    Agregar
                </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                {payments.map((p, idx) => (
                    <Chip
                        key={idx}
                        label={format(new Date(p.date), 'dd/MM/yyyy')}
                        disabled={formData.payments?.length > 0}
                        onDelete={() => {
                            if (open === 'EDIT') {
                                handleDeleteFreeLoanPaymentDate(p)
                            } else {
                                setPayments(prev => [...prev.filter(item => item.idx !== idx)])
                            }
                        }}
                    />
                ))}
            </Box>
        </Box>
    )
}