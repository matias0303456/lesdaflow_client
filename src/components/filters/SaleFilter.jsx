import { useContext, useEffect, useState } from "react";
import { Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';

import { AuthContext } from "../../providers/AuthProvider";
import { PageContext } from "../../providers/PageProvider";

export function SaleFilter({ sales, getter }) {

    const { auth } = useContext(AuthContext)
    const { page, setPage, offset, setOffset, search, setSearch } = useContext(PageContext)

    const [users] = useState(Array.from(new Set(sales.map(s => s.client.user.username))))

    const [filter, setFilter] = useState({
        id: '',
        client: '',
        type: 'ALL',
        pending: true,
        from: '',
        to: '',
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
            from: '',
            to: '',
            user: ''
        })
        setPage({ ...page, 'sales': 0 })
        setOffset({ ...offset, 'sales': 25 })
    }

    useEffect(() => {
        (async () => {
            let params = ''
            if (typeof filter.from === 'object' && new Date(filter.from).toISOString().length > 0) {
                params += `&from=${new Date(filter.from).toISOString()}`
            }
            if (typeof filter.to === 'object' && new Date(filter.to).toISOString().length > 0) {
                params += `&to=${new Date(filter.to).toISOString()}`
            }
            if (filter.id.length > 0) params += `&id=${filter.id}`
            if (filter.client.length > 0) params += `&client=${filter.client}`
            if (filter.type.length > 0) params += `&type=${filter.type}`
            if (filter.pending) params += `&pending=${filter.pending}`
            if (filter.user.length > 0) params += `&user=${filter.user}`
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
                                value={typeof filter.from === 'object' ? new Date(filter.from) : new Date(Date.now())}
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
                                value={typeof filter.to === 'object' ? new Date(filter.to) : new Date(Date.now())}
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