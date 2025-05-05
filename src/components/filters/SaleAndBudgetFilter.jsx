/* eslint-disable react/prop-types */
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

export function SaleAndBudgetFilter({ filter, setFilter }) {

    const handleReset = () => {
        setFilter({
            page: 0,
            offset: 25,
            client: '',
            id: '',
            date: '',
            type: ''
        })
    }

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, width: { xs: '100%', md: '80%' }, alignItems: 'center', justifyContent: 'end' }}>
            <FormControl>
                <InputLabel htmlFor="client">Cliente</InputLabel>
                <Input
                    id="client"
                    type="text"
                    name="client"
                    value={filter.client}
                    onChange={(e) => setFilter({ ...filter, client: e.target.value })}
                />
            </FormControl>
            <FormControl >
                <InputLabel htmlFor="id">N°</InputLabel>
                <Input
                    id="id"
                    type="number"
                    name="id"
                    value={filter.id}
                    onChange={e => setFilter({ ...filter, id: e.target.value })}
                />
            </FormControl>
            <FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                        label="Fecha"
                        value={filter.date.length === 0 ? new Date(Date.now()) : new Date(filter.date)}
                        onChange={value => setFilter({ ...filter, date: new Date(value.toISOString()) })}
                    />
                </LocalizationProvider>
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
            <Button type="button" variant="outlined" onClick={handleReset}>
                Reiniciar filtros
            </Button>
        </Box>
    )
}