import { useContext } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";

import { FiltersContext } from "../../providers/FiltersProvider";

export function UserFilter() {

    const { state, dispatch } = useContext(FiltersContext)

    const handleChange = e => {
        dispatch({
            type: 'USERS',
            payload: {
                ...state.users,
                filters: {
                    ...state.users.filters,
                    [e.target.name]: e.target.value
                }
            }
        })
    }

    const handleReset = () => {
        dispatch({
            type: 'USERS',
            payload: {
                ...state.users,
                filters: { name: '', role: '' }
            }
        })
    }

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: { xs: '100%', md: '60%', lg: '40%' }, justifyContent: 'space-between' }}>
            <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                <InputLabel htmlFor="name">Nombre</InputLabel>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    value={state.users.filters.name}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                <InputLabel id="role-select">Rol</InputLabel>
                <Select
                    labelId="role-select"
                    id="role"
                    value={state.users.filters.role}
                    label="Rol"
                    name="role"
                    onChange={handleChange}
                >
                    <MenuItem value="">Seleccione</MenuItem>
                    <MenuItem value="ADMINISTRADOR">ADMINISTRADOR</MenuItem>
                    <MenuItem value="VENDEDOR">VENDEDOR</MenuItem>
                    <MenuItem value="CHOFER">CHOFER</MenuItem>
                </Select>
            </FormControl>
            <Button type="button" variant="outlined" onClick={handleReset}>
                Reiniciar filtros
            </Button>
        </Box>
    )
}