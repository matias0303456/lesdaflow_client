import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export function ProductFilter({ products, setProducts, suppliers }) {

    const [backup] = useState(products)

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
        setProducts(backup)
    }

    useEffect(() => {
        setProducts(backup.filter(item =>
            item.code.toLowerCase().includes(filter.code.toLowerCase()) &&
            item.details.toLowerCase().includes(filter.details.toLowerCase()) &&
            item.size.toString().toLowerCase().includes(filter.size.toLowerCase()) &&
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