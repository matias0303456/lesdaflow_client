import { Box, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { useContext, useEffect, useState } from "react";

import { DataContext } from "../../providers/DataProvider";
import { useSales } from "../../hooks/useSales";

export function SaleFilter({ showSeller }) {

    const { state, dispatch } = useContext(DataContext)

    const { getSales } = useSales()

    const [filter, setFilter] = useState({ client: '', work_place: '', id: '', user: '' })

    const handleChange = e => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        const { client, work_place, id, user } = filter
        if (client.length > 0 || work_place.length > 0 || id.length > 0 || user.length > 0) {
            dispatch({
                type: 'SALES',
                payload: {
                    ...state.sales,
                    filters: `&client=${client}&work_place=${work_place}&id=${id}&user=${user}`
                }
            })
        } else {
            getSales(`?page=${state.sales.page}&offset=${state.sales.offset}`)
        }
    }, [filter])

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'end', gap: 2 }}>
            <FormControl sx={{ width: '23%' }}>
                <InputLabel htmlFor="client">Cliente</InputLabel>
                <Input id="client" type="text" name="client" value={filter.client} onChange={handleChange} />
            </FormControl>
            <FormControl sx={{ width: '23%' }}>
                <InputLabel htmlFor="work_place">Nombre Comercio</InputLabel>
                <Input id="work_place" type="text" name="work_place" value={filter.work_place} onChange={handleChange} />
            </FormControl>
            <FormControl sx={{ width: '23%' }}>
                <InputLabel htmlFor="id">N° venta</InputLabel>
                <Input id="id" type="number" name="id" value={filter.id} onChange={handleChange} />
            </FormControl>
            {showSeller &&
                <FormControl sx={{ width: '23%' }}>
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
                        {state.users.data.map(u => (
                            <MenuItem key={u.id} value={u.username}>{`${u.first_name} ${u.last_name}`}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            }
        </Box>
    )
}