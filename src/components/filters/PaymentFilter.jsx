import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { AuthContext } from "../../providers/AuthProvider";
import { FiltersContext } from "../../providers/FiltersProvider";

import { REPORT_URL } from "../../utils/urls";

export function PaymentFilter() {

    const { auth } = useContext(AuthContext)
    const { state, dispatch } = useContext(FiltersContext)

    const [filter, setFilter] = useState({ sale_id: '', from: '', to: '', p_type: '', created_by: '' })

    const handleChange = e => setFilter({ ...filter, [e.target.name]: e.target.value })

    const handleReset = () => setFilter({ sale_id: '', from: '', to: '', p_type: '', created_by: '' })

    useEffect(() => {
        const { sale_id, from, to, p_type, created_by } = filter
        const fromIsNotString = typeof from !== 'string'
        const toIsNotString = typeof to !== 'string'
        dispatch({
            type: 'PAYMENTS',
            payload: {
                ...state.payments,
                filters: `&from=${fromIsNotString ? new Date(from).toISOString() : ''}&to=${toIsNotString ? new Date(to).toISOString() : ''}&sale_id=${sale_id}&p_type=${p_type}&created_by=${created_by}`
            }
        })
    }, [filter])

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'start', flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: { xs: 2, sm: 0 } }}>
                    <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                        <InputLabel htmlFor="sale_id">N° vta.</InputLabel>
                        <Input
                            id="sale_id"
                            type="text"
                            name="sale_id"
                            value={filter.sale_id}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Desde"
                                value={filter.from.length === 0 ? new Date(Date.now()) : new Date(filter.from)}
                                onChange={value => handleChange({ target: { name: 'from', value: new Date(value.toISOString()) } })}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                        <InputLabel id="type-select">T. pago</InputLabel>
                        <Select
                            labelId="type-select"
                            id="p_type"
                            value={filter.p_type}
                            label="T. pago"
                            name="p_type"
                            onChange={handleChange}
                        >
                            <MenuItem value="">Seleccione</MenuItem>
                            <MenuItem value="EFECTIVO">EFECTIVO</MenuItem>
                            <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
                            <MenuItem value="CHEQUE">CHEQUE</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                        <InputLabel htmlFor="created_by">Reg. por</InputLabel>
                        <Input
                            id="created_by"
                            type="text"
                            name="created_by"
                            value={filter.created_by}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Hasta"
                                value={filter.to.length === 0 ? new Date(Date.now()) : new Date(filter.to)}
                                onChange={value => handleChange({ target: { name: 'to', value: new Date(value.toISOString()) } })}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    {/* <FormControlLabel
                        sx={{ width: { xs: '100%', sm: '30%' } }}
                        control={<Checkbox />}
                        label="Cancelados"
                        checked={filter.is_canceled}
                        onChange={e => handleChange({ target: { name: 'is_canceled', value: e.target.checked } })}
                    /> */}
                </Box>
            </Box>
            <Button type="button" variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' } }} onClick={handleReset}>
                Reiniciar filtros
            </Button>
            <Button variant="outlined" color='error' sx={{ width: { xs: '100%', sm: 'auto' } }} onClick={() => {
                window.open(`${REPORT_URL}/commissions-pdf?token=${auth?.token}${state.payments.filters}`, '_blank')
            }}>
                PDF
            </Button>
        </Box>
    )
}