import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export function UserFilter({ users, setUsers }) {

    const [backup] = useState(users)

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
        setUsers(backup)
    }

    useEffect(() => {
        setUsers(backup.filter(item =>
            item.first_name.toLowerCase().includes(filter.first_name.toLowerCase()) &&
            item.last_name.toLowerCase().includes(filter.last_name.toLowerCase()) &&
            item.username.toLowerCase().includes(filter.username.toLowerCase()) &&
            item.email.toLowerCase().includes(filter.email.toLowerCase())
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
                    <Input id="email" type="email" name="email" value={filter.email} onChange={handleChange} />
                </FormControl>
                <Button variant="outlined" onClick={handleReset}>
                    Reiniciar
                </Button>
            </Box>
        </Box>
    )
}