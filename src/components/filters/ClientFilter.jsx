import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../providers/AuthProvider";

export function ClientFilter({ clients, setClients }) {

    const { auth } = useContext(AuthContext)

    const [backup] = useState(clients)
    const [users] = useState(Array.from(new Set(clients.map(c => c.user.username))))

    const [filter, setFilter] = useState({
        code: '',
        first_name: '',
        last_name: '',
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
            first_name: '',
            last_name: '',
            email: '',
            username: ''
        })
        setClients(backup)
    }

    useEffect(() => {
        setClients(backup.filter(item =>
            item.code.toLowerCase().includes(filter.code.toLowerCase()) &&
            item.first_name.toLowerCase().includes(filter.first_name.toLowerCase()) &&
            item.last_name.toLowerCase().includes(filter.last_name.toLowerCase()) &&
            item.email.toLowerCase().includes(filter.email.toLowerCase()) &&
            item.user.username.toLowerCase().includes(filter.username.toLowerCase())
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
                    <InputLabel htmlFor="first_name">Nombre</InputLabel>
                    <Input id="first_name" type="text" name="first_name" value={filter.first_name} onChange={handleChange} />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="last_name">Apellido</InputLabel>
                    <Input id="last_name" type="text" name="last_name" value={filter.last_name} onChange={handleChange} />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input id="email" type="email" name="email" value={filter.email} onChange={handleChange} />
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