import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";

import { PageContext } from "../../providers/PageProvider";

export function ProductFilter({ suppliers, getter }) {

    const { page, setPage, offset, setOffset, search, setSearch } = useContext(PageContext)

    const [filter, setFilter] = useState({
        code: '',
        details: '',
        size: '',
        supplier_id: ''
    })

    const handleChange = e => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        })
    }

    const handleReset = () => {
        setFilter({
            code: '',
            details: '',
            size: '',
            supplier_id: ''
        })
        setPage({ ...page, 'products': 0 })
        setOffset({ ...offset, 'products': 25 })
    }

    useEffect(() => {
        (async () => {
            let params = ''
            if (filter.code.length > 0) params += `&code=${filter.code}`
            if (filter.details.length > 0) params += `&details=${filter.details}`
            if (filter.size.length > 0) params += `&size=${filter.size}`
            if (filter.supplier_id.toString().length > 0) params += `&supplier_id=${filter.supplier_id}`
            setSearch(params)
        })()
    }, [filter])

    useEffect(() => {
        (async () => {
            await getter()
        })()
    }, [search])

    return (
        <Box sx={{
            marginTop: { xs: 3, sm: 0 },
            borderRadius: 1
        }}>
            <Typography variant="h6">
                Filtrar
            </Typography>
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                flexDirection: {
                    xs: 'column',
                    md: 'row'
                }
            }}>
                <FormControl>
                    <InputLabel htmlFor="code">Código</InputLabel>
                    <Input id="code" type="text" name="code" value={filter.code} onChange={handleChange} />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="details">Detalle</InputLabel>
                    <Input id="details" type="text" name="details" value={filter.details} onChange={handleChange} />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="size">Talle</InputLabel>
                    <Input id="size" type="text" name="size" value={filter.size} onChange={handleChange} />
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
                        {suppliers.map(s => (
                            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="outlined" onClick={handleReset}>
                    Reiniciar
                </Button>
            </Box>
        </Box>
    )
}