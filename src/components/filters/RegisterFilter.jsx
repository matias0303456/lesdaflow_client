import { useContext, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";
import { useRegisters } from "../../hooks/useRegisters";

export function RegisterFilter() {

    const { state, dispatch } = useContext(DataContext)

    const { getRegisters } = useRegisters()

    const handleChange = e => {
        dispatch({
            type: 'REGISTERS',
            payload: {
                ...state.registers,
                filter_fields: {
                    ...state.registers.filter_fields,
                    loaded: true,
                    [e.target.name]: e.target.value
                }
            }
        })
    }

    useEffect(() => {
        const { user, loaded } = state.registers.filter_fields
        if (user.length > 0) {
            dispatch({
                type: 'REGISTERS',
                payload: {
                    ...state.registers,
                    filters: `&user=${user}`
                }
            })
        } else if (loaded) {
            getRegisters(`?page=${state.registers.page}&offset=${state.registers.offset}`)
        }
    }, [state.registers.filter_fields])

    return (
        <FormControl sx={{ width: '20%' }}>
            <InputLabel htmlFor="user">Usuario</InputLabel>
            <Select
                labelId="user-select"
                id="user"
                value={state.registers.filter_fields.user}
                label="Usuario"
                name="user"
                onChange={handleChange}
                sx={{ width: "100%" }}
            >
                {[
                    <MenuItem value="" key="select">Seleccione</MenuItem>,
                    ...(state.users.data.length > 0 ?
                        state.users.data.map((u) => (
                            <MenuItem key={u.id} value={u.username}>
                                {`${u.name}`.toUpperCase()}
                            </MenuItem>
                        ))
                        : [<MenuItem key="no-results">No se encontraron resultados</MenuItem>])
                ]}
            </Select>
        </FormControl>
    )
}