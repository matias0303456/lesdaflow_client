import { useContext } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { FiltersContext } from "../../providers/FiltersProvider";
import { DataContext } from "../../providers/DataProvider";

export function RegisterFilter() {

    const { state: dataState } = useContext(DataContext)
    const { state: filtersState, dispatch } = useContext(FiltersContext)

    const handleChange = e => {
        dispatch({
            type: 'REGISTERS',
            payload: {
                ...filtersState.registers,
                filters: {
                    ...filtersState.registers.filters,
                    [e.target.name]: e.target.value
                }
            }
        })
    }

    return (
        <FormControl sx={{ width: '20%' }}>
            <InputLabel htmlFor="user">Usuario</InputLabel>
            <Select
                labelId="user-select"
                id="user"
                value={filtersState.registers.filters.user}
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