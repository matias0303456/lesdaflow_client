import { useContext, useEffect } from "react";
import { Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { DataContext } from "../../providers/DataProvider";
import { useSales } from "../../hooks/useSales";

export function SaleFilter({ showWorkPlace, showSeller, showDate, showType, width }) {

    const { state, dispatch } = useContext(DataContext)

    const { getSales } = useSales()

    const handleChange = e => {
        dispatch({
            type: 'SALES',
            payload: {
                ...state.sales,
                filter_fields: {
                    ...state.sales.filter_fields,
                    loaded: true,
                    [e.target.name]: e.target.value
                }
            }
        })
    }

    const handleReset = () => {
        dispatch({
            type: 'SALES',
            payload: {
                ...state.sales,
                filter_fields: { client: '', work_place: '', id: '', user: '', date: '', type: '', loaded: false },
                filters: ''
            }
        })
    }

    useEffect(() => {
        const { client, work_place, id, user, date, type, loaded } = state.sales.filter_fields
        const dateIsNotString = typeof date !== 'string'
        if (client.length > 0 || work_place.length > 0 || id.length > 0 ||
            user.length > 0 || dateIsNotString || type.length > 0) {
            dispatch({
                type: 'SALES',
                payload: {
                    ...state.sales,
                    filters: `&client=${client}&work_place=${work_place}&id=${id}&user=${user}&date=${dateIsNotString ? new Date(date).toISOString() : ''}&type=${type}`
                }
            })
        } else if (loaded) {
            getSales(`?page=${state.sales.page}&offset=${state.sales.offset}`)
        }
    }, [state.sales.filter_fields])

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, width: width.main, alignItems: 'center', justifyContent: 'end' }}>
            <FormControl sx={{ width: width.client }}>
                <InputLabel htmlFor="client">Cliente</InputLabel>
                <Input
                    id="client"
                    type="text"
                    name="client"
                    value={state.sales.filter_fields.client}
                    onChange={handleChange}
                />
            </FormControl>
            {showWorkPlace &&
                <FormControl sx={{ width: width.work_place }}>
                    <InputLabel htmlFor="work_place">N. Comercio</InputLabel>
                    <Input
                        id="work_place"
                        type="text"
                        name="work_place"
                        value={state.sales.filter_fields.work_place}
                        onChange={handleChange}
                    />
                </FormControl>
            }
            <FormControl sx={{ width: width.id }}>
                <InputLabel htmlFor="id">N° venta</InputLabel>
                <Input
                    id="id"
                    type="number"
                    name="id"
                    value={state.sales.filter_fields.id}
                    onChange={handleChange}
                />
            </FormControl>
            {showSeller &&
                <FormControl sx={{ width: width.seller }}>
                    <InputLabel id="user-select">Vendedor</InputLabel>
                    <Select
                        labelId="user-select"
                        id="user"
                        value={state.sales.filter_fields.user}
                        label="Vendedor"
                        name="user"
                        onChange={handleChange}
                    >
                        <MenuItem value="">Seleccione</MenuItem>
                        {state.users.data.map(u => (
                            <MenuItem key={u.id} value={u.username}>{u.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            }
            {showDate &&
                <FormControl sx={{ width: width.date }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Fecha"
                            value={state.sales.filter_fields.date.length === 0 ? new Date(Date.now()) : new Date(state.sales.filter_fields.date)}
                            onChange={value => handleChange({
                                target: {
                                    name: 'date',
                                    value: new Date(value.toISOString())
                                }
                            })}
                        />
                    </LocalizationProvider>
                </FormControl>
            }
            {showType &&
                <FormControl sx={{ width: width.type }}>
                    <InputLabel id="type-select">T. Vta.</InputLabel>
                    <Select
                        labelId="type-select"
                        id="type"
                        value={state.sales.filter_fields.type}
                        label="Tipo Comp."
                        name="type"
                        onChange={handleChange}
                    >
                        <MenuItem value="">Seleccione</MenuItem>
                        <MenuItem value="CONTADO">CONTADO</MenuItem>
                        <MenuItem value="CUENTA_CORRIENTE">CTA CTE</MenuItem>
                        <MenuItem value="POXIPOL">POXIPOL</MenuItem>
                    </Select>
                </FormControl>
            }
            <Button type="button" variant="outlined" sx={{ width: width.btn }} onClick={handleReset}>
                Reiniciar filtros
            </Button>
        </Box>
    )
}