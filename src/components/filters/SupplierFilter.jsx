import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { PageContext } from "../../providers/PageProvider";

export function SupplierFilter({ getter }) {

    const { page, setPage, offset, setOffset, search, setSearch } = useContext(PageContext)

    const [filter, setFilter] = useState({ name: '' })

    const handleChange = e => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        })
    }

    const handleReset = () => {
        setFilter({ name: '' })
        setPage({ ...page, 'suppliers': 0 })
        setOffset({ ...offset, 'suppliers': 25 })
    }

    useEffect(() => {
        (async () => {
            let params = ''
            if (filter.name.length > 0) params += `&name=${filter.name}`
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