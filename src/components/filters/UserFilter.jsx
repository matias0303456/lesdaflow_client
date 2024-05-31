import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";
import { useUsers } from "../../hooks/useUsers";

export function UserFilter() {

    const { state, dispatch } = useContext(DataContext)

    const { getUsers } = useUsers()

    const [show, setShow] = useState(
        state.users.filter_fields.first_name.length > 0 ||
        state.users.filter_fields.last_name.length > 0 ||
        state.users.filter_fields.role.length > 0
    )

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
                filter_fields: { first_name: '', last_name: '', role: '', loaded: false },
                filters: ''
            }
        })
    }

    const handleToggleShow = () => setShow(!show)

    useEffect(() => {
        const { first_name, last_name, role, loaded } = state.users.filter_fields
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
    }, [state.users.filter_fields])

    return (
        <>
            {show ?
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl>
                            <InputLabel htmlFor="first_name">Nombre</InputLabel>
                            <Input
                                id="first_name"
                                type="text"
                                name="first_name"
                                value={state.users.filter_fields.first_name}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="last_name">Apellido</InputLabel>
                            <Input
                                id="last_name"
                                type="text"
                                name="last_name"
                                value={state.users.filter_fields.last_name}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl>
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