import { useContext, useEffect } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";
import { useProducts } from "../../hooks/useProducts";

export function ProductFilter() {

    const { state, dispatch } = useContext(DataContext)

    const { getProducts } = useProducts()

    const handleChange = e => {
        dispatch({
            type: 'PRODUCTS',
            payload: {
                ...state.products,
                filter_fields: {
                    ...state.products.filter_fields,
                    loaded: true,
                    [e.target.name]: e.target.value
                }
            }
        })
    }

    const handleReset = () => {
        dispatch({
            type: 'PRODUCTS',
            payload: {
                ...state.products,
                filter_fields: { code: '', details: '', supplier_id: '', loaded: false },
                filters: ''
            }
        })
    }

    useEffect(() => {
        const { code, details, supplier_id, loaded } = state.products.filter_fields
        if (code.length > 0 || details.length > 0 || supplier_id.toString().length > 0) {
            dispatch({
                type: 'PRODUCTS',
                payload: {
                    ...state.products,
                    filters: `&code=${code}&details=${details}&supplier_id=${supplier_id}`
                }
            })
        } else if (loaded) {
            getProducts(`?page=${state.products.page}&offset=${state.products.offset}`)
        }
    }, [state.products.filter_fields])

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            width: { xs: '100%', sm: 'auto' }
        }}>
            <FormControl>
                <InputLabel htmlFor="code">Código</InputLabel>
                <Input
                    id="code"
                    type="text"
                    name="code"
                    value={state.products.filter_fields.code}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="details">Producto</InputLabel>
                <Input
                    id="details"
                    type="text"
                    name="details"
                    value={state.products.filter_fields.details}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                <InputLabel id="supplier-select">Proveedor</InputLabel>
                <Select
                    labelId="supplier-select"
                    id="supplier_id"
                    value={state.products.filter_fields.supplier_id}
                    label="Proveedor"
                    name="supplier_id"
                    onChange={handleChange}
                >
                    <MenuItem value="">Seleccione</MenuItem>
                    {state.suppliers.data.map(s => (
                        <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button type="button" variant="outlined" onClick={handleReset}>
                Reiniciar filtros
            </Button>
        </Box >
    )
}