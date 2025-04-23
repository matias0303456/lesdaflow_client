/* eslint-disable react/prop-types */
import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";

export function SupplierFilter({ filter, setFilter }) {

    const handleReset = () => {
        setFilter({
            page: 0,
            offset: 25,
            name: ''
        })
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl>
                <InputLabel htmlFor="name">Nombre</InputLabel>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    value={filter.name}
                    onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                />
            </FormControl>
            <Button type="button" variant="outlined" onClick={handleReset}>
                Reiniciar filtro
            </Button>
        </Box>
    )
}