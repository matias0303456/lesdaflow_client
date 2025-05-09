import { useContext } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { FiltersContext } from "../../providers/FiltersProvider";

export function BudgetFilter() {

    const { state, dispatch } = useContext(FiltersContext)

    const handleChange = e => {
        dispatch({
            type: 'BUDGETS',
            payload: {
                ...state.budgets,
                filters: {
                    ...state.budgets.filters,
                    [e.target.name]: e.target.value
                }
            }
        })
    }

    const handleReset = () => {
        dispatch({
            type: 'BUDGETS',
            payload: {
                ...state.budgets,
                filters: { from: '', to: '', user: '', client: '', type: '' }
            }
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
                        value={state.budgets.filters.from.length === 0 ? new Date(Date.now()) : new Date(state.budgets.filters.from)}
                        onChange={value => handleChange({ target: { name: 'from', value: new Date(value.toISOString()) } })}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', md: '20%' } }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                        label="Hasta"
                        value={state.budgets.filters.to.length === 0 ? new Date(Date.now()) : new Date(state.budgets.filters.to)}
                        onChange={value => handleChange({ target: { name: 'to', value: new Date(value.toISOString()) } })}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', md: '15%' } }}>
                <InputLabel htmlFor="client">Cliente</InputLabel>
                <Input
                    id="client"
                    type="text"
                    name="client"
                    value={state.budgets.filters.client}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', md: '15%' } }}>
                <InputLabel htmlFor="user">Vendedor</InputLabel>
                <Input
                    id="user"
                    type="text"
                    name="user"
                    value={state.budgets.filters.user}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', md: '10%' } }}>
                <InputLabel id="type-select">Tipo</InputLabel>
                <Select
                    labelId="type-select"
                    id="type"
                    value={state.budgets.filters.type}
                    label="Tipo"
                    name="type"
                    onChange={handleChange}
                >
                    <MenuItem value="">Seleccione</MenuItem>
                    <MenuItem value="CUENTA_CORRIENTE">CTA CTE</MenuItem>
                    <MenuItem value="CONTADO">CONTADO</MenuItem>
                    <MenuItem value="POXIPOL">POXIPOL</MenuItem>
                </Select>
            </FormControl>
            <Button type="button" variant="outlined" onClick={handleReset} sx={{ width: { xs: '100%', md: '15%' } }}>
                Reiniciar filtros
            </Button>
        </Box>
    )
}