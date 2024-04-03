import { Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../providers/AuthProvider";

import { getAccountStatus } from "../../utils/helpers";

export function SaleFilter({ sales, setSales }) {

    const { auth } = useContext(AuthContext)

    const [backup] = useState(sales.sort((a, b) => new Date(b.date) - new Date(a.date)))
    const [users] = useState(Array.from(new Set(sales.map(s => s.client.user.username))))

    const [filter, setFilter] = useState({
        id: '',
        client: '',
        type: 'ALL',
        pending: true,
        user: ''
    })

    const handleChange = e => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        })
    }

    const handleReset = () => {
        setFilter({
            id: '',
            client: '',
            type: 'ALL',
            pending: true,
            user: ''
        })
        setSales(backup)
    }

    useEffect(() => {
        setSales(backup.filter(item => {
            return (
                item.client.code.toLowerCase().includes(filter.client.toLowerCase()) ||
                item.client.name.toLowerCase().includes(filter.client.toLowerCase())
            ) &&
                item.client.user.username.toLowerCase().includes(filter.user.toLowerCase()) &&
                (filter.type === 'ALL' || item.type === filter.type) &&
                (filter.id.length === 0 || Math.abs(parseInt(filter.id)) === item.id) &&
                (!filter.pending || getAccountStatus(item) === 'Pendiente')
        }))
    }, [backup, filter])

    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center' }}>
                <FormControl>
                    <InputLabel htmlFor="id">N° venta</InputLabel>
                    <Input id="id" type="number" name="id" value={filter.id} onChange={handleChange} />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="client">Cliente</InputLabel>
                    <Input id="client" type="text" name="client" value={filter.client} onChange={handleChange} />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <FormControlLabel
                    control={<Checkbox />}
                    label="Todas"
                    checked={filter.type === 'ALL'}
                    onChange={e => {
                        if (e.target.checked) {
                            handleChange({
                                target: {
                                    name: 'type',
                                    value: 'ALL'
                                }
                            })
                        }
                    }}
                />
                <FormControlLabel
                    control={<Checkbox />}
                    label="Cuenta Corriente"
                    checked={filter.type === 'CUENTA_CORRIENTE'}
                    onChange={e => {
                        if (e.target.checked) {
                            handleChange({
                                target: {
                                    name: 'type',
                                    value: 'CUENTA_CORRIENTE'
                                }
                            })
                        }
                    }}
                />
                <FormControlLabel
                    control={<Checkbox />}
                    label="Contado"
                    checked={filter.type === 'CONTADO'}
                    onChange={e => {
                        if (e.target.checked) {
                            handleChange({
                                target: {
                                    name: 'type',
                                    value: 'CONTADO'
                                }
                            })
                        }
                    }}
                />
                <FormControlLabel
                    control={<Checkbox />}
                    label="Pendientes"
                    checked={filter.pending}
                    onChange={e => {
                        handleChange({
                            target: {
                                name: 'pending',
                                value: e.target.checked
                            }
                        })
                    }}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center' }}>
                {auth?.user.role.name === 'ADMINISTRADOR' &&
                    <FormControl>
                        <InputLabel id="user-select">Vendedor</InputLabel>
                        <Select
                            labelId="user-select"
                            id="user"
                            value={filter.user}
                            label="Vendedor"
                            name="user"
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
                    Reiniciar Filtros
                </Button>
            </Box>
        </Box>
    )
}