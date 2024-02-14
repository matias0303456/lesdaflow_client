import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';

import { setFromDate, setLocalDate, setToDate } from "../../utils/helpers";

export function IncomeFilter({ incomes, setIncomes }) {

    const [backup] = useState(incomes)

    const [filter, setFilter] = useState({
        product: '',
        from: new Date(backup[backup.length - 1] ? setLocalDate(backup[backup.length - 1].created_at) : Date.now()),
        to: new Date(backup[0] ? setLocalDate(backup[0].created_at) : Date.now())
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
            from: new Date(backup[backup.length - 1] ? setLocalDate(backup[backup.length - 1].created_at) : Date.now()),
            to: new Date(backup[0] ? setLocalDate(backup[0].created_at) : Date.now())
        })
        setIncomes(backup)
    }

    useEffect(() => {
        setIncomes(backup.filter(item => {
            return (
                item.product.code.toLowerCase().includes(filter.product.toLowerCase()) ||
                item.product.details.toLowerCase().includes(filter.product.toLowerCase()) ||
                item.product.size.toLowerCase().includes(filter.product.toLowerCase()) 
            ) &&
                setLocalDate(item.created_at) >= setFromDate(filter.from) &&
                setLocalDate(item.created_at) <= setToDate(filter.to)
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
                    <InputLabel htmlFor="product">Producto</InputLabel>
                    <Input id="product" type="text" name="product" value={filter.product} onChange={handleChange} />
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