/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";

export function ArticleFilter({ filter, setFilter }) {

    const { state } = useContext(DataContext)

    const handleReset = () => {
        setFilter({
            page: 0,
            offset: 25,
            code: '',
            details: '',
            supplier_id: ''
        })
    }

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
                    onChange={e => setFilter({ ...filter, code: e.target.value })}
                />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="details">Artículo</InputLabel>
                <Input
                    id="details"
                    type="text"
                    name="details"
                    value={filter.details}
                    onChange={e => setFilter({ ...filter, details: e.target.value })}
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
                    onChange={e => setFilter({ ...filter, supplier_id: e.target.value })}
                >
                    <MenuItem value="">Seleccione</MenuItem>
                    {state.suppliers.map(s => (
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