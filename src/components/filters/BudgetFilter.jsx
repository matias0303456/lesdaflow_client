/* eslint-disable react/prop-types */
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

export function BudgetFilter({ filter, setFilter }) {

    const handleReset = () => {
        setFilter({
            page: 0,
            offset: 25,
            from: '',
            to: '',
            client: '',
            type: ''
        })
    }

    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: { xs: 2, md: 1 },
            width: { xs: '100%', md: '75%' },
            justifyContent: 'space-between'
        }}>
            <FormControl sx={{ width: { xs: '100%', md: '20%' } }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                        label="Desde"
                        value={filter.from.length === 0 ? new Date(Date.now()) : new Date(filter.from)}
                        onChange={value => setFilter({ ...filter, from: new Date(value.toISOString()) })}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', md: '20%' } }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                        label="Hasta"
                        value={filter.to.length === 0 ? new Date(Date.now()) : new Date(filter.to)}
                        onChange={value => setFilter({ ...filter, to: new Date(value.toISOString()) })}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', md: '20%' } }}>
                <InputLabel htmlFor="client">Cliente</InputLabel>
                <Input
                    id="client"
                    type="text"
                    name="client"
                    value={filter.client}
                    onChange={e => setFilter({ ...filter, client: e.target.value })}
                />
            </FormControl>
            <FormControl sx={{ width: 100 }}>
                <InputLabel id="type-select">Tipo</InputLabel>
                <Select
                    labelId="type-select"
                    id="type"
                    value={filter.type}
                    label="Tipo Comp."
                    name="type"
                    onChange={e => setFilter({ ...filter, type: e.target.value })}
                >
                    <MenuItem value="">Seleccione</MenuItem>
                    <MenuItem value="EFECTIVO">EFECTIVO</MenuItem>
                    <MenuItem value="CONTADO">CONTADO</MenuItem>
                    <MenuItem value="DEBITO">DEBITO</MenuItem>
                    <MenuItem value="CREDITO">CREDITO</MenuItem>
                    <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
                </Select>
            </FormControl>
            <Button type="button" variant="outlined" onClick={handleReset} sx={{ width: { xs: '100%', md: '15%' } }}>
                Reiniciar filtros
            </Button>
        </Box>
    )
}