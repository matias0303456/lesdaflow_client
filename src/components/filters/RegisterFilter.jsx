import { useContext, useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { FiltersContext } from "../../providers/FiltersProvider";
import { DataContext } from "../../providers/DataProvider";

export function RegisterFilter() {

    const { state: dataState } = useContext(DataContext)
    const { state, dispatch } = useContext(FiltersContext)

    const [filter, setFilter] = useState({ user: '' })

    const handleChange = e => setFilter({ ...filter, [e.target.name]: e.target.value })

    useEffect(() => {
        const { user } = filter
        dispatch({
            type: 'REGISTERS',
            payload: {
                ...state.registers,
                filters: `&user=${user}`
            }
        })
    }, [filter])

    return (
        <FormControl sx={{ width: '20%' }}>
            <InputLabel htmlFor="user">Usuario</InputLabel>
            <Select
                labelId="user-select"
                id="user"
                value={filter.user}
                label="Usuario"
                name="user"
                onChange={handleChange}
                sx={{ width: "100%" }}
            >
                {[
                    <MenuItem value="" key="select">Seleccione</MenuItem>,
                    ...(dataState.users.data.length > 0 ?
                        dataState.users.data.map((u) => (
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