import { useContext, useEffect } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { DataContext } from "../../providers/DataProvider";

export function BudgetFilter() {

    const { state, dispatch } = useContext(DataContext)

    const handleChange = e => {
        dispatch({
            type: 'BUDGETS',
            payload: {
                ...state.budgets,
                filter_fields: {
                    ...state.budgets.filter_fields,
                    loaded: true,
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
                filter_fields: { from: '', to: '', user: '', client: '', type: '', loaded: false },
                filters: ''
            }
        })
    }

    useEffect(() => {
        const { from, to, user, client, loaded, type } = state.budgets.filter_fields
        const fromIsNotString = typeof from !== 'string'
        const toIsNotString = typeof to !== 'string'
        if (fromIsNotString || toIsNotString || user.length > 0 || client.length > 0 || type.length > 0) {
            dispatch({
                type: 'BUDGETS',
                payload: {
                    ...state.budgets,
                    filters: `&from=${fromIsNotString ? new Date(from).toISOString() : ''}&to=${toIsNotString ? new Date(to).toISOString() : ''}&user=${user}&client=${client}&type=${type}`
                }
            })
        } else if (loaded) {
            dispatch({
                type: 'BUDGETS',
                payload: {
                    ...state.budgets,
                    filters: ''
                }
            })
        }
    }, [state.budgets.filter_fields])

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
                        value={state.budgets.filter_fields.from.length === 0 ? new Date(Date.now()) : new Date(state.budgets.filter_fields.from)}
                        onChange={value => handleChange({ target: { name: 'from', value: new Date(value.toISOString()) } })}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', md: '20%' } }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                        label="Hasta"
                        value={state.budgets.filter_fields.to.length === 0 ? new Date(Date.now()) : new Date(state.budgets.filter_fields.to)}
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
                    value={state.budgets.filter_fields.client}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', md: '15%' } }}>
                <InputLabel htmlFor="user">Vendedor</InputLabel>
                <Input
                    id="user"
                    type="text"
                    name="user"
                    value={state.budgets.filter_fields.user}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', md: '10%' } }}>
                <InputLabel id="type-select">Tipo</InputLabel>
                <Select
                    labelId="type-select"
                    id="type"
                    value={state.budgets.filter_fields.type}
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