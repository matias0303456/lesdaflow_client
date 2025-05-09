/* eslint-disable react/prop-types */
import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";

export function ClientFilter({ filter, setFilter }) {

    const handleReset = () => {
        setFilter({
            page: 0,
            offset: 25,
            first_name: '',
            last_name: '',
            work_place: ''
        })
    }

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 3 }}>
            <FormControl>
                <InputLabel htmlFor="first_name">Nombre</InputLabel>
                <Input
                    id="first_name"
                    type="text"
                    name="first_name"
                    value={filter.first_name}
                    onChange={e => setFilter({ ...filter, first_name: e.target.value })}
                />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="last_name">Apellido</InputLabel>
                <Input
                    id="last_name"
                    type="text"
                    name="last_name"
                    value={filter.last_name}
                    onChange={e => setFilter({ ...filter, last_name: e.target.value })}
                />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="name">Comercio</InputLabel>
                <Input
                    id="work_place"
                    type="text"
                    name="work_place"
                    value={filter.work_place}
                    onChange={e => setFilter({ ...filter, work_place: e.target.value })}
                />
            </FormControl>
            <Button type="button" variant="outlined" onClick={handleReset}>
                Reiniciar filtros
            </Button>
        </Box>
    )
}