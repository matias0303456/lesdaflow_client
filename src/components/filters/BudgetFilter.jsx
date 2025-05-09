import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { FiltersContext } from "../../providers/FiltersProvider";

export function BudgetFilter() {

    const { state, dispatch } = useContext(FiltersContext)

    const [filter, setFilter] = useState({ from: '', to: '', user: '', client: '', type: '' })

    const handleChange = e => setFilter({ ...filter, [e.target.name]: e.target.value })

    const handleReset = () => setFilter({ from: '', to: '', user: '', client: '', type: '' })

    useEffect(() => {
        const { from, to, user, client, type } = filter
        const fromIsNotString = typeof from !== 'string'
        const toIsNotString = typeof to !== 'string'
        dispatch({
            type: 'BUDGETS',
            payload: {
                ...state.budgets,
                filters: `&from=${fromIsNotString ? new Date(from).toISOString() : ''}&to=${toIsNotString ? new Date(to).toISOString() : ''}&user=${user}&client=${client}&type=${type}`
            }
        })
    }, [filter])

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
                        onChange={value => handleChange({ target: { name: 'from', value: new Date(value.toISOString()) } })}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', md: '20%' } }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                        label="Hasta"
                        value={filter.to.length === 0 ? new Date(Date.now()) : new Date(filter.to)}
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
                    value={filter.client}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', md: '15%' } }}>
                <InputLabel htmlFor="user">Vendedor</InputLabel>
                <Input
                    id="user"
                    type="text"
                    name="user"
                    value={filter.user}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', md: '10%' } }}>
                <InputLabel id="type-select">Tipo</InputLabel>
                <Select
                    labelId="type-select"
                    id="type"
                    value={filter.type}
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