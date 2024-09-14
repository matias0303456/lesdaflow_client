import { useContext, useEffect } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { AuthContext } from "../../providers/AuthProvider";
import { DataContext } from "../../providers/DataProvider";

import { REPORT_URL } from "../../utils/urls";

export function PaymentFilter() {

    const { auth } = useContext(AuthContext)
    const { state, dispatch } = useContext(DataContext)

    const handleChange = e => {
        dispatch({
            type: 'PAYMENTS',
            payload: {
                ...state.payments,
                filter_fields: {
                    ...state.payments.filter_fields,
                    loaded: true,
                    [e.target.name]: e.target.value
                }
            }
        })
    }

    const handleReset = () => {
        dispatch({
            type: 'PAYMENTS',
            payload: {
                ...state.payments,
                filter_fields: { sale_id: '', from: '', to: '', p_type: '', created_by: '', loaded: false },
                filters: ''
            }
        })
    }

    useEffect(() => {
        const { sale_id, from, to, p_type, created_by, loaded } = state.payments.filter_fields
        const fromIsNotString = typeof from !== 'string'
        const toIsNotString = typeof to !== 'string'
        if (fromIsNotString || toIsNotString || sale_id.length > 0 || p_type.length > 0 || created_by.length > 0) {
            dispatch({
                type: 'PAYMENTS',
                payload: {
                    ...state.payments,
                    filters: `&from=${fromIsNotString ? new Date(from).toISOString() : ''}&to=${toIsNotString ? new Date(to).toISOString() : ''}&sale_id=${sale_id}&p_type=${p_type}&created_by=${created_by}`
                }
            })
        } else if (loaded) {
            dispatch({
                type: 'PAYMENTS',
                payload: {
                    ...state.payments,
                    filters: ''
                }
            })
        }
    }, [state.payments.filter_fields])

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
                            value={state.payments.filter_fields.sale_id}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Desde"
                                value={state.payments.filter_fields.from.length === 0 ? new Date(Date.now()) : new Date(state.payments.filter_fields.from)}
                                onChange={value => handleChange({ target: { name: 'from', value: new Date(value.toISOString()) } })}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                        <InputLabel id="type-select">T. pago</InputLabel>
                        <Select
                            labelId="type-select"
                            id="p_type"
                            value={state.payments.filter_fields.p_type}
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
                            value={state.payments.filter_fields.created_by}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Hasta"
                                value={state.payments.filter_fields.to.length === 0 ? new Date(Date.now()) : new Date(state.payments.filter_fields.to)}
                                onChange={value => handleChange({ target: { name: 'to', value: new Date(value.toISOString()) } })}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    {/* <FormControlLabel
                        sx={{ width: { xs: '100%', sm: '30%' } }}
                        control={<Checkbox />}
                        label="Cancelados"
                        checked={state.payments.filter_fields.is_canceled}
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