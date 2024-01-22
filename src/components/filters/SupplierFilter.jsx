import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export function SupplierFilter({ suppliers, setSuppliers }) {

    const [backup] = useState(suppliers)

    const [filter, setFilter] = useState({ name: '' })

    const handleChange = e => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        })
    }

    const handleReset = e => {
        setFilter({ name: '' })
        setSuppliers(backup)
    }

    useEffect(() => {
        setSuppliers(backup.filter(item => item.name.toLowerCase().includes(filter.name.toLowerCase())))
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
                <Button variant="outlined" onClick={handleReset}>
                    Reiniciar
                </Button>
            </Box>
        </Box>
    )
}