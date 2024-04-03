import { Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel } from "@mui/material";
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
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2
        }}>
            <FormControl>
                <InputLabel htmlFor="name">Comercio</InputLabel>
                <Input id="work_place" type="text" name="work_place" value={filter.work_place} onChange={handleChange} />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="name">Nombre y Apellido</InputLabel>
                <Input id="name" type="text" name="name" value={filter.name} onChange={handleChange} />
            </FormControl>
            <FormControlLabel control={<Checkbox />} label="Bloqueado" />
            <Button variant="outlined" onClick={handleReset}>
                Reiniciar Filtros
            </Button>
        </Box>
    )
}