import { useContext } from "react";
import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";

import { FiltersContext } from "../../providers/FiltersProvider";

export function ClientFilter() {

    const { state, dispatch } = useContext(FiltersContext)

    const handleChange = e => {
        dispatch({
            type: 'CLIENTS',
            payload: {
                ...state.clients,
                filters: {
                    ...state.clients.filters,
                    [e.target.name]: e.target.value
                }
            }
        })
    }

    const handleReset = () => {
        dispatch({
            type: 'CLIENTS',
            payload: {
                ...state.clients,
                filters: { first_name: '', last_name: '', work_place: '' }
            }
        })
    }

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
            <FormControl>
                <InputLabel htmlFor="first_name">Nombre</InputLabel>
                <Input
                    id="first_name"
                    type="text"
                    name="first_name"
                    value={state.clients.filters.first_name}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="last_name">Apellido</InputLabel>
                <Input
                    id="last_name"
                    type="text"
                    name="last_name"
                    value={state.clients.filters.last_name}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="name">Comercio</InputLabel>
                <Input
                    id="work_place"
                    type="text"
                    name="work_place"
                    value={state.clients.filters.work_place}
                    onChange={handleChange}
                />
            </FormControl>
            <Button type="button" variant="outlined" onClick={handleReset}>
                Reiniciar filtros
            </Button>
        </Box>
    )
}