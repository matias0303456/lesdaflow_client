import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";

import { FiltersContext } from "../../providers/FiltersProvider";

export function SupplierFilter() {

    const { state, dispatch } = useContext(FiltersContext)

    const [filter, setFilter] = useState({ name: '' })

    const handleChange = e => setFilter({ ...filter, [e.target.name]: e.target.value })

    const handleReset = () => setFilter({ name: '' })

    useEffect(() => {
        const { name } = filter
        dispatch({
            type: 'SUPPLIERS',
            payload: {
                ...state.suppliers,
                filters: `&name=${name}`
            }
        })
    }, [filter])

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl>
                <InputLabel htmlFor="name">Nombre</InputLabel>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    value={filter.name}
                    onChange={handleChange}
                />
            </FormControl>
            <Button type="button" variant="outlined" onClick={handleReset}>
                Reiniciar filtro
            </Button>
        </Box>
    )
}