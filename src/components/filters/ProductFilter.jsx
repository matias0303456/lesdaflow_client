import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export function ProductFilter({ products, setProducts, suppliers }) {

    const [backup] = useState(products)

    const [filter, setFilter] = useState({
        name: '',
        code: '',
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
            name: '',
            code: '',
            supplier_id: ''
        })
        setProducts(backup)
    }

    useEffect(() => {
        setProducts(backup.filter(item =>
            item.name.toLowerCase().includes(filter.name.toLowerCase()) &&
            item.code.toLowerCase().includes(filter.code.toLowerCase()) &&
            (filter.supplier_id.length === 0 || parseInt(item.supplier.id) === parseInt(filter.supplier_id))
        ))
    }, [filter])

    return (
        <Box sx={{
            marginBottom: 1,
            marginTop: { xs: 3, sm: 0 },
            padding: 1,
            borderRadius: 1
        }}>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
                Filtrar
            </Typography>
            <Box sx={{
                display: 'flex',
                gap: 3,
                flexDirection: {
                    xs: 'column',
                    md: 'row'
                }
            }}>
                <FormControl>
                    <InputLabel htmlFor="name">Nombre</InputLabel>
                    <Input id="name" type="text" name="name" value={filter.name} onChange={handleChange} />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="code">Código</InputLabel>
                    <Input id="code" type="text" name="code" value={filter.code} onChange={handleChange} />
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