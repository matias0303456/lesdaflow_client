import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';

import { setLocalDate } from "../../utils/helpers";
import { PageContext } from "../../providers/PageProvider";

export function MovementFilter({ registers, entityKey, getter }) {

    const { page, setPage, offset, setOffset, search, setSearch } = useContext(PageContext)

    const [defaultFrom] = useState(new Date(registers[registers.length - 1] ? setLocalDate(registers[registers.length - 1].created_at) : Date.now()))
    const [defaultTo] = useState(new Date(registers[0] ? setLocalDate(registers[0].created_at) : Date.now()))
    const [filter, setFilter] = useState({
        product: '',
        from: defaultFrom,
        to: defaultTo
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
            from: defaultFrom,
            to: defaultTo
        })
        setPage({ ...page, [entityKey]: 0 })
        setOffset({ ...offset, [entityKey]: 25 })
    }

    useEffect(() => {
        (async () => {
            let params = `&from=${filter.from.toISOString()}&to=${filter.to.toISOString()}`
            if (filter.product.length > 0) params += `&product=${filter.product}`
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