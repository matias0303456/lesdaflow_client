import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";
import { useUsers } from "../../hooks/useUsers";

export function UserFilter() {

    const { state, dispatch } = useContext(DataContext)

    const { getUsers } = useUsers()

    const [filter, setFilter] = useState({ first_name: '', last_name: '', role: '', loaded: false })
    const [show, setShow] = useState(false)

    const handleChange = e => {
        setFilter({
            ...filter,
            loaded: true,
            [e.target.name]: e.target.value
        })
    }

    const handleReset = () => {
        setFilter({
            first_name: '',
            last_name: '',
            role: '',
            loaded: true
        })
    }

    const handleToggleShow = () => setShow(!show)

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
        <>
            {show ?
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl>
                            <InputLabel htmlFor="first_name">Nombre</InputLabel>
                            <Input id="first_name" type="text" name="first_name" value={filter.first_name} onChange={handleChange} />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="last_name">Apellido</InputLabel>
                            <Input id="last_name" type="text" name="last_name" value={filter.last_name} onChange={handleChange} />
                        </FormControl>
                        <FormControl>
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button type="button" variant="outlined" onClick={handleReset}>
                            Reiniciar filtros
                        </Button>
                        <Button type="button" variant="outlined" onClick={handleToggleShow}>
                            Ocultar filtros
                        </Button>
                    </Box>
                </Box> :
                <Button type="button" variant="outlined" onClick={handleToggleShow}>
                    Mostrar filtros
                </Button>
            }
        </>
    )
}