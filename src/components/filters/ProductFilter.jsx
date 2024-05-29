import { useContext, useEffect, useState } from "react";
import { Box, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";
import { useProducts } from "../../hooks/useProducts";

export function ProductFilter() {

    const { state, dispatch } = useContext(DataContext)

    const { getProducts } = useProducts()

    const [filter, setFilter] = useState({
        code: '',
        details: '',
        supplier_id: '',
        loaded: false
    })

    const handleChange = e => {
        setFilter({
            ...filter,
            loaded: true,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        const { code, details, supplier_id, loaded } = filter
        if (code.length > 0 || details.length > 0 || supplier_id.length > 0) {
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
    }, [filter])

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
            <FormControl>
                <InputLabel htmlFor="code">Código</InputLabel>
                <Input id="code" type="text" name="code" value={filter.code} onChange={handleChange} />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="details">Producto</InputLabel>
                <Input id="details" type="text" name="details" value={filter.details} onChange={handleChange} />
            </FormControl>
            <FormControl>
                <InputLabel id="supplier-select">Proveedor</InputLabel>
                <Select
                    labelId="supplier-select"
                    id="supplier_id"
                    value={filter.supplier_id}
                    label="Proveedor"
                    name="supplier_id"
                    sx={{ width: { xs: '100%', md: 150 } }}
                    onChange={handleChange}
                >
                    <MenuItem value="">Seleccione</MenuItem>
                    {state.suppliers.data.map(s => (
                        <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}