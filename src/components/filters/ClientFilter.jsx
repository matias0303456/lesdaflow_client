import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";

import { AuthContext } from "../../providers/AuthProvider";
import { PageContext } from "../../providers/PageProvider";

export function ClientFilter({ clients, getter }) {

    const { auth } = useContext(AuthContext)
    const { page, setPage, offset, setOffset, search, setSearch } = useContext(PageContext)

    const [users] = useState(Array.from(new Set(clients.map(c => c.user?.username))))

    const [filter, setFilter] = useState({
        code: '',
        name: '',
        email: '',
        username: ''
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
            name: '',
            email: '',
            username: ''
        })
        setPage({ ...page, 'clients': 0 })
        setOffset({ ...offset, 'clients': 25 })
    }

    useEffect(() => {
        (async () => {
            let params = ''
            if (filter.code.length > 0) params += `&code=${filter.code}`
            if (filter.name.length > 0) params += `&name=${filter.name}`
            if (filter.email.length > 0) params += `&email=${filter.email}`
            if (filter.username.length > 0) params += `&username=${filter.username}`
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
                    <InputLabel htmlFor="code">Código</InputLabel>
                    <Input id="code" type="text" name="code" value={filter.code} onChange={handleChange} />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="name">Nombre y Apellido</InputLabel>
                    <Input id="name" type="text" name="name" value={filter.name} onChange={handleChange} />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input id="email" type="text" name="email" value={filter.email} onChange={handleChange} />
                </FormControl>
                {auth?.user.role.name === 'ADMINISTRADOR' &&
                    <FormControl>
                        <InputLabel id="user-select">Vendedor</InputLabel>
                        <Select
                            labelId="user-select"
                            id="username"
                            value={filter.username}
                            label="Vendedor"
                            name="username"
                            sx={{ width: { xs: '100%', md: 150 } }}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Seleccione</MenuItem>
                            {users.map(u => (
                                <MenuItem key={u} value={u}>{u}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                }
                <Button variant="outlined" onClick={handleReset}>
                    Reiniciar
                </Button>
            </Box>
        </Box>
    )
}