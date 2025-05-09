/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { FiltersContext } from "../../providers/FiltersProvider";
import { DataContext } from "../../providers/DataProvider";

export function SaleFilter({
    showWorkPlace,
    showSeller,
    showDate,
    showType,
    width,
    showPending,
    pendingFilter,
    setPendingFilter
}) {

    const { state: dataState } = useContext(DataContext)
    const { state, dispatch } = useContext(FiltersContext)

    const [filter, setFilter] = useState({ client: '', work_place: '', id: '', user: '', date: '', type: '' })

    const handleChange = e => setFilter({ ...filter, [e.target.name]: e.target.value })

    const handleReset = () => setFilter({ client: '', work_place: '', id: '', user: '', date: '', type: '' })

    useEffect(() => {
        const { client, work_place, id, user, date, type } = filter
        const dateIsNotString = typeof date !== 'string'
        dispatch({
            type: 'SALES',
            payload: {
                ...state.sales,
                filters: `&client=${client}&work_place=${work_place}&id=${id}&user=${user}&date=${dateIsNotString ? new Date(date).toISOString() : ''}&type=${type}`
            }
        })
    }, [filter, pendingFilter])

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, width: width.main, alignItems: 'center', justifyContent: 'end' }}>
            <FormControl sx={{ width: width.client }}>
                <InputLabel htmlFor="client">Cliente</InputLabel>
                <Input
                    id="client"
                    type="text"
                    name="client"
                    value={filter.client}
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
                        value={filter.work_place}
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
                    value={filter.id}
                    onChange={handleChange}
                />
            </FormControl>
            {showSeller &&
                <FormControl sx={{ width: width.seller }}>
                    <InputLabel id="user-select">Vendedor</InputLabel>
                    <Select
                        labelId="user-select"
                        id="user"
                        value={filter.user}
                        label="Vendedor"
                        name="user"
                        onChange={handleChange}
                    >
                        <MenuItem value="">Seleccione</MenuItem>
                        {dataState.users.data.map(u => (
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
                            value={filter.date.length === 0 ? new Date(Date.now()) : new Date(filter.date)}
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
                        value={filter.type}
                        label="Tipo Comp."
                        name="type"
                        onChange={handleChange}
                    >
                        <MenuItem value="">Seleccione</MenuItem>
                        <MenuItem value="CONTADO">CONTADO</MenuItem>
                        <MenuItem value="POXIPOL">POXIPOL</MenuItem>
                    </Select>
                </FormControl>
            }
            {showPending &&
                <FormControlLabel
                    control={<Checkbox />}
                    label="Pendientes"
                    checked={pendingFilter}
                    onChange={e => setPendingFilter(e.target.checked)}
                />
            }
            <Button type="button" variant="outlined" sx={{ width: width.btn }} onClick={handleReset}>
                Reiniciar filtros
            </Button>
        </Box>
    )
}