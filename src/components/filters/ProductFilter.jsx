import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";

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
    const [show, setShow] = useState(false)

    const handleChange = e => {
        setFilter({
            ...filter,
            loaded: true,
            [e.target.name]: e.target.value
        })
    }

    const handleReset = () => {
        setFilter({
            code: '',
            details: '',
            supplier_id: '',
            loaded: true
        })
    }

    const handleToggleShow = () => setShow(!show)

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
        <>
            {show ?
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                                sx={{ width: '100%' }}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Seleccione</MenuItem>
                                {state.suppliers.data.map(s => (
                                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button type="button" variant="outlined" onClick={handleReset}>
                            Reiniciar filtros
                        </Button>
                        <Button type="button" variant="outlined" onClick={handleToggleShow}>
                            Ocultar filtros
                        </Button>
                    </Box>
                </Box > :
                <Button type="button" variant="outlined" onClick={handleToggleShow}>
                    Mostrar filtros
                </Button>
            }
        </>
    )
}