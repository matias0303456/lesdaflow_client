/* eslint-disable react/prop-types */
import { useContext } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";

export function RegisterFilter({ filter, setFilter }) {

    const { state } = useContext(DataContext)

    return (
        <FormControl sx={{ width: '20%' }}>
            <InputLabel htmlFor="user">Usuario</InputLabel>
            <Select
                labelId="user-select"
                id="user"
                value={filter.user}
                label="Usuario"
                name="user"
                onChange={e => setFilter({ ...filter, user: e.target.value })}
                sx={{ width: "100%" }}
            >
                {[
                    <MenuItem value="" key="select">Seleccione</MenuItem>,
                    ...(state.users.length > 0 ?
                        state.users.map((u) => (
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