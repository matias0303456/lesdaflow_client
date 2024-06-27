import { useState } from "react";
import { Autocomplete, Box, Button, FormControl, Input, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import CancelSharpIcon from '@mui/icons-material/CancelSharp';

export function IncomesByAmount({
    incomesByAmount,
    setIncomesByAmount,
    amount,
    setAmount,
    products,
    handleClose,
    handleSubmit
}) {

    const [value, setValue] = useState('')

    const handleAdd = data => {
        if (data.product_id.toString().length > 0) {
            setIncomesByAmount([
                ...incomesByAmount.filter(iba => iba.product_id !== data.product_id),
                data
            ])
            setTimeout(() => {
                setValue('')
            }, 1000)
        }
    }

    const handleDeleteProduct = (id) => {
        setIncomesByAmount([...incomesByAmount.filter(iba => iba.product_id !== id)])
    }

    const handleChangeObservations = (data) => {
        setIncomesByAmount([
            ...incomesByAmount.filter(iba => iba.product_id !== data.product_id),
            {
                ...incomesByAmount.find(iba => iba.product_id === data.product_id),
                ...data
            }
        ].sort((a, b) => a.idx - b.idx))
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 3, margin: 1, marginBottom: 2, justifyContent: 'center' }}>
                <FormControl sx={{ width: '20%' }}>
                    <InputLabel htmlFor="amount">Cantidad</InputLabel>
                    <Input
                        type="number"
                        value={amount === 0 ? 1 : Math.abs(amount)}
                        onChange={e => setAmount(parseInt(e.target.value) === 0 ? 1 : Math.abs(parseInt(e.target.value)))}
                    />
                </FormControl>
                <Autocomplete
                    disablePortal
                    id="product-autocomplete"
                    options={products.filter(p => !incomesByAmount.map(iba => iba.product_id).includes(p.id))
                        .map(p => ({ label: `Código ${p.code} / Detalle ${p.details} / Talle ${p.size}`, id: p.id }))}
                    noOptionsText="No hay productos disponibles."
                    onChange={(e, value) => handleAdd({ idx: incomesByAmount.length, product_id: value?.id, observations: '' })}
                    renderInput={(params) => <TextField {...params} label="Agregar producto..." />}
                    isOptionEqualToValue={(option, value) => option.code === value.code || value.length === 0}
                    onInputChange={(e, value) => setValue(value)}
                    value={value}
                    onBlur={() => setValue('')}
                    sx={{ width: '60%' }}
                />
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Código</TableCell>
                            <TableCell align="center">Detalle</TableCell>
                            <TableCell align="center">Talle</TableCell>
                            <TableCell align="center">Stock actual</TableCell>
                            <TableCell align="center">Nuevo stock</TableCell>
                            <TableCell align="center">Observaciones</TableCell>
                            <TableCell align="center">Borrar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {incomesByAmount.length === 0 ?
                            <TableRow>
                                <TableCell align="center" colSpan={7}>No hay productos que mostrar.</TableCell>
                            </TableRow> :
                            incomesByAmount.map(iba => {
                                const p = products.find(p => p.id === iba.product_id)
                                return (
                                    <TableRow key={iba.product_id}>
                                        <TableCell align="center">{p.code}</TableCell>
                                        <TableCell align="center">{p.details}</TableCell>
                                        <TableCell align="center">{p.size}</TableCell>
                                        <TableCell align="center">{p.stock}</TableCell>
                                        <TableCell align="center">{parseInt(p.stock + amount)}</TableCell>
                                        <TableCell align="center">
                                            <FormControl>
                                                <InputLabel htmlFor="observations">Observaciones</InputLabel>
                                                <Input
                                                    id="observations"
                                                    type="text"
                                                    name="observations"
                                                    value={iba.observations}
                                                    onChange={(e) => handleChangeObservations({
                                                        product_id: iba.product_id,
                                                        observations: e.target.value
                                                    })}
                                                />
                                                {iba.observations.length > 191 &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * Las observaciones son demasiado largas.
                                                    </Typography>
                                                }
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button type="button" onClick={() => handleDeleteProduct(p?.id)}>
                                                <CancelSharpIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'center', width: '60%', margin: '0 auto', marginTop: 3 }}>
                <Button type="button" variant="outlined" sx={{ width: '50%' }} onClick={handleClose}>
                    Cancelar
                </Button>
                <Button
                    type="button"
                    variant="contained"
                    sx={{ width: '50%' }}
                    disabled={incomesByAmount.length === 0}
                    onClick={e => handleSubmit(e, handleClose)}
                >
                    Guardar
                </Button>
            </Box>
        </Box>
    )
}