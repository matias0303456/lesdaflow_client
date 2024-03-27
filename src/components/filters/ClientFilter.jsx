import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../providers/AuthProvider";

export function ClientFilter({ clients, setClients }) {

    const { auth } = useContext(AuthContext)

    const [backup] = useState(clients)
    const [users] = useState(Array.from(new Set(clients.map(c => c.user.username))))

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
        setClients(backup)
    }

    useEffect(() => {
        setClients(backup.filter(item =>
            item.code.toLowerCase().includes(filter.code.toLowerCase()) &&
            item.name.toLowerCase().includes(filter.name.toLowerCase()) &&
            item.email.toLowerCase().includes(filter.email.toLowerCase()) &&
            item.user.username.toLowerCase().includes(filter.username.toLowerCase())
        ))
    }, [filter])

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'column'
            }}>
                <FormControl>
                    <InputLabel htmlFor="name">Nombre y Apellido</InputLabel>
                    <Input id="name" type="text" name="name" value={filter.name} onChange={handleChange} />
                </FormControl>
                {/* {auth?.user.role.name === 'ADMINISTRADOR' &&
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
                } */}
                <Button variant="outlined" onClick={handleReset}>
                    Reiniciar
                </Button>
            </Box>
        </Box>
    )
}