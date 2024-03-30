import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';

import { PageContext } from "../../providers/PageProvider";

export function MovementFilter({ entityKey, getter }) {

    const { page, setPage, offset, setOffset, search, setSearch } = useContext(PageContext)

    const [filter, setFilter] = useState({
        product: '',
        from: '',
        to: ''
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
            from: '',
            to: ''
        })
        setPage({ ...page, [entityKey]: 0 })
        setOffset({ ...offset, [entityKey]: 25 })
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
                <Button variant="outlined" onClick={handleReset}>
                    Reiniciar
                </Button>
            </Box>
        </Box>
    )
}