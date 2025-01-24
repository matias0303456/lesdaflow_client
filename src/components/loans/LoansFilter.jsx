/* eslint-disable react/prop-types */
import { Box, Button, Checkbox, FormControl, FormControlLabel, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

export function LoansFilter({
    formData,
    setFormData,
    user,
    setOpen,
    filter,
    setFilter
}) {
    return (
        <Box sx={{ display: 'flex', gap: { xs: 2, md: 1 }, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button sx={{ color: '#FFF' }} variant="contained" onClick={() => {
                setFormData({ ...formData, late_fee: user.settings.late_fee })
                setOpen('NEW')
            }}>
                Agregar
            </Button>
            <FormControl sx={{ width: { xs: '100%', lg: '10%' } }}>
                <TextField
                    label="N° préstamo"
                    type="number"
                    value={filter.id || ''}
                    onChange={(e) => setFilter({ ...filter, id: e.target.value })}
                />
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', lg: '15%' } }}>
                <TextField
                    label="Cliente"
                    value={filter.client || ''}
                    onChange={(e) => setFilter({ ...filter, client: e.target.value })}
                />
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', lg: '15%' } }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                        label="Desde"
                        value={filter.from.length === 0 ? new Date(Date.now()) : new Date(filter.from)}
                        disabled={formData.payments?.length > 0}
                        onChange={value => setFilter({ ...filter, from: new Date(value).toISOString() })}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', lg: '15%' } }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                        label="Hasta"
                        value={filter.to.length === 0 ? new Date(Date.now()) : new Date(filter.to)}
                        disabled={formData.payments?.length > 0}
                        onChange={value => setFilter({ ...filter, to: new Date(value).toISOString() })}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControlLabel
                control={<Checkbox />}
                label="Pendientes"
                checked={filter.pending}
                onChange={(e) => setFilter({ ...filter, pending: e.target.checked })}
            />
            <Button
                variant="outlined"
                sx={{ width: { xs: '100%', lg: 'auto' } }}
                onClick={() => setFilter({ from: '', to: '', client: '', id: '', pending: false })}
            >
                Reiniciar
            </Button>
        </Box>
    )
}