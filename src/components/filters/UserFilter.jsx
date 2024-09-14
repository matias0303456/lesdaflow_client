import { useContext, useEffect } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";

export function UserFilter() {

    const { state, dispatch } = useContext(DataContext)

    const handleChange = e => {
        dispatch({
            type: 'USERS',
            payload: {
                ...state.users,
                filter_fields: {
                    ...state.users.filter_fields,
                    loaded: true,
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
                filter_fields: { name: '', role: '', loaded: false },
                filters: ''
            }
        })
    }

    useEffect(() => {
        const { name, role, loaded } = state.users.filter_fields
        if (name.length > 0 || role.length > 0) {
            dispatch({
                type: 'USERS',
                payload: {
                    ...state.users,
                    filters: `&name=${name}&role=${role}`
                }
            })
        } else if (loaded) {
            dispatch({
                type: 'USERS',
                payload: {
                    ...state.users,
                    filters: ''
                }
            })
        }
    }, [state.users.filter_fields])

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: { xs: '100%', md: '60%', lg: '40%' }, justifyContent: 'space-between' }}>
            <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                <InputLabel htmlFor="name">Nombre</InputLabel>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    value={state.users.filter_fields.name}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                <InputLabel id="role-select">Rol</InputLabel>
                <Select
                    labelId="role-select"
                    id="role"
                    value={state.users.filter_fields.role}
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