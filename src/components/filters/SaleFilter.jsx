import { Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';

import { AuthContext } from "../../providers/AuthProvider";

import { getAccountStatus, setFromDate, setLocalDate, setToDate } from "../../utils/helpers";

export function SaleFilter({ sales, setSales }) {

    const { auth } = useContext(AuthContext)

    const [backup] = useState(sales.sort((a, b) => new Date(b.date) - new Date(a.date)))
    const [users] = useState(Array.from(new Set(sales.map(s => s.client.user.username))))

    const [filter, setFilter] = useState({
        id: '',
        client: '',
        type: 'ALL',
        pending: true,
        from: new Date(backup[backup.length - 1] ? setLocalDate(backup[backup.length - 1].date) : Date.now()),
        to: new Date(backup[0] ? setLocalDate(backup[0].date) : Date.now()),
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
            from: new Date(backup[backup.length - 1] ? setLocalDate(backup[backup.length - 1].date) : Date.now()),
            to: new Date(backup[0] ? setLocalDate(backup[0].date) : Date.now()),
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
                setLocalDate(item.date) >= setFromDate(filter.from) &&
                setLocalDate(item.date) <= setToDate(filter.to) &&
                item.client.user.username.toLowerCase().includes(filter.user.toLowerCase()) &&
                (filter.type === 'ALL' || item.type === filter.type) &&
                (filter.id.length === 0 || Math.abs(parseInt(filter.id)) === item.id) &&
                (!filter.pending || getAccountStatus(item) === 'Pendiente')
        }))
    }, [backup, filter])

    return (
        <Box sx={{
            marginTop: { xs: 3, sm: 0 },
            padding: 1,
            borderRadius: 1
        }}>
            <Typography variant="h6">
                Filtrar
            </Typography>
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'start',
                gap: 3,
                flexDirection: {
                    xs: 'column',
                    md: 'row'
                }
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center' }}>
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
                        Reiniciar
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}