import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';

import { AuthContext } from "../../providers/AuthProvider";

export function SaleFilter({ sales, setSales }) {

    const { auth } = useContext(AuthContext)

    const [backup] = useState(sales.sort((a, b) => new Date(a.date) - new Date(b.date)))
    const [users] = useState(Array.from(new Set(sales.map(s => s.client.user.username))))

    const [filter, setFilter] = useState({
        product: '',
        client: '',
        from: new Date(backup[0] ? backup[0].date.split('T')[0] + 'T03:00:00.000Z' : Date.now()),
        to: new Date(backup[backup.length - 1] ? backup[backup.length - 1].date.split('T')[0] + 'T20:59:00.000Z' : Date.now()),
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
            product: '',
            client: '',
            from: new Date(backup[0] ? backup[0].date.split('T')[0] + 'T03:00:00.000Z' : Date.now()),
            to: new Date(backup[backup.length - 1] ? backup[backup.length - 1]?.date.split('T')[0] + 'T20:59:00.000Z' : Date.now()),
            user: ''
        })
        setIncomes(backup)
    }

    useEffect(() => {
        setSales(backup.filter(item => {
            return (
                item.product.code.toLowerCase().includes(filter.product.toLowerCase()) ||
                item.product.name.toLowerCase().includes(filter.product.toLowerCase())
            ) && (
                    item.client.code.toLowerCase().includes(filter.client.toLowerCase()) ||
                    item.client.first_name.toLowerCase().includes(filter.client.toLowerCase()) ||
                    item.client.last_name.toLowerCase().includes(filter.client.toLowerCase())
                ) &&
                new Date(item.date) >= filter.from &&
                new Date(item.date) <= filter.to &&
                item.client.user.username.toLowerCase().includes(filter.user.toLowerCase())
        }))
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
                    <InputLabel htmlFor="product">Producto</InputLabel>
                    <Input id="product" type="text" name="product" value={filter.product} onChange={handleChange} />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="client">Cliente</InputLabel>
                    <Input id="client" type="text" name="client" value={filter.client} onChange={handleChange} />
                </FormControl>
                <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Desde"
                            value={new Date(filter.from)}
                            onChange={value => handleChange({
                                target: {
                                    name: 'from',
                                    value: new Date(value.toISOString())
                                }
                            })}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Hasta"
                            value={new Date(filter.to)}
                            onChange={value => handleChange({
                                target: {
                                    name: 'to',
                                    value: new Date(value.toISOString())
                                }
                            })}
                        />
                    </LocalizationProvider>
                </FormControl>
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
                    Reiniciar
                </Button>
            </Box>
        </Box>
    )
}