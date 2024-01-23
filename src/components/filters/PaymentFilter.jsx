import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';

import { setFromDate, setLocalDate, setToDate } from "../../utils/helpers";

export function PaymentFilter({ payments, setPayments }) {

    const [backup] = useState(payments.sort((a, b) => new Date(a.date) - new Date(b.date)))

    const [filter, setFilter] = useState({
        client: '',
        from: new Date(backup[0] ? setLocalDate(backup[0].date) : Date.now()),
        to: new Date(backup[backup.length - 1] ? setLocalDate(backup[backup.length - 1].date) : Date.now())
    })

    const handleChange = e => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        })
    }

    const handleReset = () => {
        setFilter({
            client: '',
            from: new Date(backup[0] ? setLocalDate(backup[0].date) : Date.now()),
            to: new Date(backup[backup.length - 1] ? setLocalDate(backup[backup.length - 1].date) : Date.now())
        })
        setPayments(backup)
    }

    useEffect(() => {
        setPayments(backup.filter(item => {
            return (
                item.sale.client.code.toLowerCase().includes(filter.client.toLowerCase()) ||
                item.sale.client.first_name.toLowerCase().includes(filter.client.toLowerCase()) ||
                item.sale.client.last_name.toLowerCase().includes(filter.client.toLowerCase())
            ) &&
                setLocalDate(item.date) >= setFromDate(filter.from) &&
                setLocalDate(item.date) <= setToDate(filter.to)
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
                gap: 3,
                flexDirection: {
                    xs: 'column',
                    md: 'row'
                }
            }}>
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
                <Button variant="outlined" onClick={handleReset}>
                    Reiniciar
                </Button>
            </Box>
        </Box>
    )
}