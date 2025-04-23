/* eslint-disable react/prop-types */
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";

export function UserFilter({ filter, setFilter }) {

    const handleReset = () => {
        setFilter({
            page: 0,
            offset: 60,
            name: '',
            role: ''
        })
    }

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: { xs: '100%', md: '60%', lg: '40%' }, justifyContent: 'space-between' }}>
            <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                <InputLabel htmlFor="name">Nombre</InputLabel>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    value={filter.name}
                    onChange={e => setFilter({ ...filter, name: e.target.value })}
                />
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                <InputLabel id="role-select">Rol</InputLabel>
                <Select
                    labelId="role-select"
                    id="role"
                    value={filter.role}
                    onChange={e => setFilter({ ...filter, role: e.target.value })}
                    label="Rol"
                    name="role"
                >
                    <MenuItem value="">Seleccione</MenuItem>
                    <MenuItem value="ADMINISTRADOR">ADMINISTRADOR</MenuItem>
                    <MenuItem value="VENDEDOR">VENDEDOR</MenuItem>
                </Select>
            </FormControl>
            <Button type="button" variant="outlined" onClick={handleReset}>
                Reiniciar filtros
            </Button>
        </Box>
    )
}