import { useContext, useEffect, useState } from "react";
import { Box, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";
import { useUsers } from "../../hooks/useUsers";

export function UserFilter() {

    const { state, dispatch } = useContext(DataContext)

    const { getUsers } = useUsers()

    const [filter, setFilter] = useState({ first_name: '', last_name: '', role: '', loaded: false })

    const handleChange = e => {
        setFilter({
            ...filter,
            loaded: true,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        const { first_name, last_name, role, loaded } = filter
        if (first_name.length > 0 || last_name.length > 0 || role.length > 0) {
            dispatch({
                type: 'USERS',
                payload: {
                    ...state.users,
                    filters: `&first_name=${first_name}&last_name=${last_name}&role=${role}`
                }
            })
        } else if (loaded) {
            getUsers(`?page=${state.users.page}&offset=${state.users.offset}`)
        }
    }, [filter])

    return (
        <Box sx={{ display: 'flex', gap: 2, width: '30%' }}>
            <FormControl sx={{ width: '30%' }}>
                <InputLabel htmlFor="first_name">Nombre</InputLabel>
                <Input id="first_name" type="text" name="first_name" value={filter.first_name} onChange={handleChange} />
            </FormControl>
            <FormControl sx={{ width: '30%' }}>
                <InputLabel htmlFor="last_name">Apellido</InputLabel>
                <Input id="last_name" type="text" name="last_name" value={filter.last_name} onChange={handleChange} />
            </FormControl>
            <FormControl sx={{ width: '40%' }}>
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
        </Box>
    )
}