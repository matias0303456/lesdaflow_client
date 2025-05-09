import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";

import { FiltersContext } from "../../providers/FiltersProvider";
import { DataContext } from "../../providers/DataProvider";

export function ProductFilter() {

    const { state: dataState } = useContext(DataContext)
    const { state, dispatch } = useContext(FiltersContext)

    const [filter, setFilter] = useState({ code: '', details: '', supplier_id: '' })

    const handleChange = e => setFilter({ ...filter, [e.target.name]: e.target.value })

    const handleReset = () => setFilter({ code: '', details: '', supplier_id: '' })

    useEffect(() => {
        const { code, details, supplier_id } = filter
        dispatch({
            type: 'PRODUCTS',
            payload: {
                ...state.products,
                filters: `&code=${code}&details=${details}&supplier_id=${supplier_id}`
            }
        })
    }, [filter])

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
                    value={filter.code}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="details">Producto</InputLabel>
                <Input
                    id="details"
                    type="text"
                    name="details"
                    value={filter.details}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                <InputLabel id="supplier-select">Proveedor</InputLabel>
                <Select
                    labelId="supplier-select"
                    id="supplier_id"
                    value={filter.supplier_id}
                    label="Proveedor"
                    name="supplier_id"
                    onChange={handleChange}
                >
                    <MenuItem value="">Seleccione</MenuItem>
                    {dataState.suppliers.data.map(s => (
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