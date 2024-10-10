/* eslint-disable react/prop-types */
import { Box, Chip, FormControl, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { format } from "date-fns";
import { es } from "date-fns/locale"

export function FreeLoanPaymentsAbm({ payments, setPayments }) {
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
                            onChange={value => setPayments([
                                ...payments,
                                {
                                    idx: payments.length,
                                    date: new Date(value.toISOString())
                                }
                            ])}
                        />
                    </LocalizationProvider>
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                {payments.map((p, idx) => (
                    <Chip
                        key={idx}
                        label={format(new Date(p.date), 'dd/MM/yyyy')}
                        onDelete={() => setPayments(prev => [...prev.filter(item => item.idx !== idx)])}
                    />
                ))}
            </Box>
        </Box>
    )
}