import { useContext, useEffect, useState } from "react";
import { Box, FormControl, Input, InputLabel } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { DataContext } from "../../providers/DataProvider";
import { useBudgets } from "../../hooks/useBudgets";

export function BudgetFilter() {

    const { state, dispatch } = useContext(DataContext)

    const { getBudgets } = useBudgets()

    const [filter, setFilter] = useState({
        from: '',
        to: '',
        user: '',
        client: '',
        loaded: false
    })

    const handleChange = e => {
        setFilter({
            ...filter,
            loaded: true,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        const { from, to, user, client, loaded } = filter
        const fromIsNotString = typeof from !== 'string'
        const toIsNotString = typeof to !== 'string'
        if (fromIsNotString || toIsNotString || user.length > 0 || client.length > 0) {
            dispatch({
                type: 'BUDGETS',
                payload: {
                    ...state.budgets,
                    filters: `&from=${fromIsNotString ? new Date(from).toISOString() : ''}&to=${toIsNotString ? new Date(to).toISOString() : ''}&user=${user}&client=${client}`
                }
            })
        } else if (loaded) {
            getBudgets(`?page=${state.budgets.page}&offset=${state.budgets.offset}`)
        }
    }, [filter])

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
            <FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                        label="Desde"
                        value={filter.from.length === 0 ? new Date(Date.now()) : new Date(filter.from)}
                        onChange={value => handleChange({ target: { name: 'from', value: new Date(value.toISOString()) } })}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                        label="Hasta"
                        value={filter.to.length === 0 ? new Date(Date.now()) : new Date(filter.to)}
                        onChange={value => handleChange({ target: { name: 'to', value: new Date(value.toISOString()) } })}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="client">Cliente</InputLabel>
                <Input id="client" type="text" name="client" value={filter.client} onChange={handleChange} />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="user">Vendedor</InputLabel>
                <Input id="user" type="text" name="user" value={filter.user} onChange={handleChange} />
            </FormControl>
        </Box>
    )
}