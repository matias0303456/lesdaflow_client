import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";

import { FiltersContext } from "../../providers/FiltersProvider";

export function UserFilter() {

    const { state, dispatch } = useContext(FiltersContext)

    const [filter, setFilter] = useState({ name: '', role: '' })

    const handleChange = e => setFilter({ ...filter, [e.target.name]: e.target.value })

    const handleReset = () => setFilter({ fname: '', role: '' })

    useEffect(() => {
        const { name, role } = filter
        dispatch({
            type: 'USERS',
            payload: {
                ...state.users,
                filters: `&name=${name}&role=${role}`
            }
        })
    }, [filter])

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: { xs: '100%', md: '60%', lg: '40%' }, justifyContent: 'space-between' }}>
            <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                <InputLabel htmlFor="name">Nombre</InputLabel>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    value={filter.name}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                <InputLabel id="role-select">Rol</InputLabel>
                <Select
                    labelId="role-select"
                    id="role"
                    value={filter.role}
                    label="Rol"
                    name="role"
                    disabled={open === 'VIEW'}
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