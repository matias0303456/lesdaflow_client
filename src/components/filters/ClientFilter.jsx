import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";

import { FiltersContext } from "../../providers/FiltersProvider";

export function ClientFilter() {

    const { state, dispatch } = useContext(FiltersContext)

    const [filter, setFilter] = useState({ first_name: '', last_name: '', work_place: '' })

    const handleChange = e => setFilter({ ...filter, [e.target.name]: e.target.value })

    const handleReset = () => setFilter({ first_name: '', last_name: '', work_place: '' })

    useEffect(() => {
        const { first_name, last_name, work_place } = filter
            dispatch({
                type: 'CLIENTS',
                payload: {
                    ...state.clients,
                    filters: `&first_name=${first_name}&last_name=${last_name}&work_place=${work_place}`
                }
            })
    }, [filter])

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
            <FormControl>
                <InputLabel htmlFor="first_name">Nombre</InputLabel>
                <Input
                    id="first_name"
                    type="text"
                    name="first_name"
                    value={filter.first_name}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="last_name">Apellido</InputLabel>
                <Input
                    id="last_name"
                    type="text"
                    name="last_name"
                    value={filter.last_name}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="name">Comercio</InputLabel>
                <Input
                    id="work_place"
                    type="text"
                    name="work_place"
                    value={filter.work_place}
                    onChange={handleChange}
                />
            </FormControl>
            <Button type="button" variant="outlined" onClick={handleReset}>
                Reiniciar filtros
            </Button>
        </Box>
    )
}