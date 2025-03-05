/* eslint-disable react/prop-types */
import { Box, Button, FormControl, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

export function SpendingsFilter({
    formData,
    reset,
    total,
    setOpen,
    filter,
    setFilter
}) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between', py: 2, px: 1 }}>
            <Box sx={{ display: 'flex', gap: { xs: 2, md: 1 }, alignItems: 'center', width: { xs: '100%', md: '70%', flexWrap: 'wrap' } }}>
                <Button sx={{ width: { xs: '100%', md: 'auto' } }} variant="outlined" onClick={() => {
                    reset()
                    setOpen('NEW')
                }}>
                    Agregar
                </Button>
                <FormControl sx={{ width: { xs: '100%', md: '20%' } }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Desde"
                            value={filter.from.length === 0 ? new Date(Date.now()) : new Date(filter.from)}
                            disabled={formData.payments?.length > 0}
                            onChange={value => setFilter({ ...filter, from: new Date(value).toISOString() })}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl sx={{ width: { xs: '100%', md: '20%' } }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Hasta"
                            value={filter.to.length === 0 ? new Date(Date.now()) : new Date(filter.to)}
                            disabled={formData.payments?.length > 0}
                            onChange={value => setFilter({ ...filter, to: new Date(value).toISOString() })}
                        />
                    </LocalizationProvider>
                </FormControl>
                <Button
                    variant="outlined"
                    sx={{ width: { xs: '100%', md: 'auto' } }}
                    onClick={() => setFilter({ from: '', to: '', client: '', id: '', pending: false })}
                >
                    Reiniciar
                </Button>
            </Box>
            <Typography variant="h6" sx={{ width: '20%', textAlign: 'end' }}>
                Total: {total}
            </Typography>
        </Box>
    )
}