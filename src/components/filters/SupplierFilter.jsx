import { useContext, useEffect } from "react";
import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";

export function SupplierFilter() {

    const { state, dispatch } = useContext(DataContext)

    const handleChange = e => {
        dispatch({
            type: 'SUPPLIERS',
            payload: {
                ...state.suppliers,
                filter_fields: {
                    ...state.suppliers.filter_fields,
                    loaded: true,
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
                filter_fields: { name: '', loaded: false },
                filters: ''
            }
        })
    }

    useEffect(() => {
        const { name, loaded } = state.suppliers.filter_fields
        if (name.length > 0) {
            dispatch({
                type: 'SUPPLIERS',
                payload: {
                    ...state.suppliers,
                    filters: `&name=${name}`
                }
            })
        } else if (loaded) {
            dispatch({
                type: 'SUPPLIERS',
                payload: {
                    ...state.suppliers,
                    filters: ''
                }
            })
        }
    }, [state.suppliers.filter_fields])

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl>
                <InputLabel htmlFor="name">Nombre</InputLabel>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    value={state.suppliers.filter_fields.name}
                    onChange={handleChange}
                />
            </FormControl>
            <Button type="button" variant="outlined" onClick={handleReset}>
                Reiniciar filtro
            </Button>
        </Box>
    )
}