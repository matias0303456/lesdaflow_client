import { Box, FormControl, Input, InputLabel } from "@mui/material";
import { useContext, useEffect, useState } from "react";

import { DataContext } from "../../providers/DataProvider";
import { useClients } from "../../hooks/useClients";

export function ClientFilter() {

    const { state, dispatch } = useContext(DataContext)

    const { getClients } = useClients()

    const [filter, setFilter] = useState({
        first_name: '',
        last_name: '',
        work_place: ''
    })

    const handleChange = e => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        const { first_name, last_name, work_place } = filter
        if (first_name.length > 0 || last_name.length > 0 || work_place.length > 0) {
            dispatch({
                type: 'CLIENTS',
                payload: {
                    ...state.clients,
                    filters: `&first_name=${first_name}&last_name=${last_name}&work_place=${work_place}`
                }
            })
        } else {
            getClients(`?page=${state.clients.page}&offset=${state.clients.offset}`)
        }
    }, [filter])

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: '50%' }}>
            <FormControl sx={{ width: '30%' }}>
                <InputLabel htmlFor="first_name">Nombre</InputLabel>
                <Input id="first_name" type="text" name="first_name" value={filter.first_name} onChange={handleChange} />
            </FormControl>
            <FormControl sx={{ width: '30%' }}>
                <InputLabel htmlFor="last_name">Apellido</InputLabel>
                <Input id="last_name" type="text" name="last_name" value={filter.last_name} onChange={handleChange} />
            </FormControl>
            <FormControl sx={{ width: '30%' }}>
                <InputLabel htmlFor="name">Comercio</InputLabel>
                <Input id="work_place" type="text" name="work_place" value={filter.work_place} onChange={handleChange} />
            </FormControl>
        </Box>
    )
}