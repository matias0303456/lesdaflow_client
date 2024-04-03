import { useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";

export function SupplierFilter({ suppliers, setSuppliers }) {

    const [backup] = useState(suppliers)

    const [filter, setFilter] = useState({ name: '' })

    const handleChange = e => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        })
    }

    const handleReset = () => {
        setFilter({ name: '' })
        setSuppliers(backup)
    }

    useEffect(() => {
        setSuppliers(backup.filter(item => item.name.toLowerCase().includes(filter.name.toLowerCase())))
    }, [filter])

    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2
        }}>
            <FormControl>
                <InputLabel htmlFor="name">Nombre</InputLabel>
                <Input id="name" type="text" name="name" value={filter.name} onChange={handleChange} />
            </FormControl>
            <Button variant="outlined" onClick={handleReset}>
                Reiniciar
            </Button>
        </Box>
    )
}