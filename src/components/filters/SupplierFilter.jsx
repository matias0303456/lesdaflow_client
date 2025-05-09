import { useContext } from "react";
import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";

import { FiltersContext } from "../../providers/FiltersProvider";

export function SupplierFilter() {

    const { state, dispatch } = useContext(FiltersContext)

    const handleChange = e => {
        dispatch({
            type: 'SUPPLIERS',
            payload: {
                ...state.suppliers,
                filters: {
                    ...state.suppliers.filters,
                    [e.target.name]: e.target.value
                }
            }
        })
    }

    const handleReset = () => {
        dispatch({
            type: 'SUPPLIERS',
            payload: {
                ...state.suppliers,
                filters: { name: '' }
            }
        })
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl>
                <InputLabel htmlFor="name">Nombre</InputLabel>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    value={state.suppliers.filters.name}
                    onChange={handleChange}
                />
            </FormControl>
            <Button type="button" variant="outlined" onClick={handleReset}>
                Reiniciar filtro
            </Button>
        </Box>
    )
}