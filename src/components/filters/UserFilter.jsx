import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { PageContext } from "../../providers/PageProvider";

export function UserFilter({ getter }) {

    const { page, setPage, offset, setOffset, search, setSearch } = useContext(PageContext)

    const [filter, setFilter] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: ''
    })

    const handleChange = e => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        })
    }

    const handleReset = () => {
        setFilter({
            first_name: '',
            last_name: '',
            username: '',
            email: ''
        })
        setPage({ ...page, 'users': 0 })
        setOffset({ ...offset, 'users': 25 })
    }

    useEffect(() => {
        (async () => {
            let params = ''
            if (filter.first_name.length > 0) params += `&first_name=${filter.first_name}`
            if (filter.last_name.length > 0) params += `&last_name=${filter.last_name}`
            if (filter.username.length > 0) params += `&username=${filter.username}`
            if (filter.email.length > 0) params += `&email=${filter.email}`
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
                    <InputLabel htmlFor="first_name">Nombre</InputLabel>
                    <Input id="first_name" type="text" name="first_name" value={filter.first_name} onChange={handleChange} />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="last_name">Apellido</InputLabel>
                    <Input id="last_name" type="text" name="last_name" value={filter.last_name} onChange={handleChange} />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="username">Usuario</InputLabel>
                    <Input id="username" type="text" name="username" value={filter.username} onChange={handleChange} />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input id="email" type="text" name="email" value={filter.email} onChange={handleChange} />
                </FormControl>
                <Button variant="outlined" onClick={handleReset}>
                    Reiniciar
                </Button>
            </Box>
        </Box>
    )
}