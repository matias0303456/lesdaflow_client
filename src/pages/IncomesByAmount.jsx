import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Box, Button, FormControl, Input, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import CancelSharpIcon from '@mui/icons-material/CancelSharp';

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useMovements } from "../hooks/useMovements";
import { useProducts } from "../hooks/useProducts";

import { Layout } from "../components/common/Layout";

import { getStock } from "../utils/helpers";

export function IncomesByAmount() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const navigate = useNavigate()

    const { getProducts } = useProducts()
    const { incomesByAmount, setIncomesByAmount, amount, setAmount, handleSubmitIncomesByAmount } = useMovements()

    const [value, setValue] = useState('')

    useEffect(() => {
        if (auth?.user.role !== "ADMINISTRADOR") {
            navigate(auth?.user.role === 'CHOFER' ? '/prep-ventas' : "/productos");
        } else {
            getProducts()
        }
    }, [])

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
        <Layout title="Ingresos por cantidad">
            <Box sx={{
                display: 'flex',
                gap: 3,
                marginBottom: 2,
                justifyContent: 'center',
                backgroundColor: '#fff',
                p: 3,
                borderRadius: 1
            }}>
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
                    options={state.products.data.filter(p => !incomesByAmount.map(iba => iba.product_id).includes(p.id))
                        .map(p => ({ label: `Código ${p.code} / Detalle ${p.details}`, id: p.id }))}
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
                            <TableCell align="center">Stock actual</TableCell>
                            <TableCell align="center">Nuevo stock</TableCell>
                            <TableCell align="center">Observaciones</TableCell>
                            <TableCell align="center">Borrar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {incomesByAmount.length === 0 ?
                            <TableRow>
                                <TableCell align="center" colSpan={6}>No hay productos que mostrar.</TableCell>
                            </TableRow> :
                            incomesByAmount.map(iba => {
                                const p = state.products.data.find(p => p.id === iba.product_id)
                                return (
                                    <TableRow key={iba.product_id}>
                                        <TableCell align="center">{p.code}</TableCell>
                                        <TableCell align="center">{p.details}</TableCell>
                                        <TableCell align="center">{getStock(p)}</TableCell>
                                        <TableCell align="center">{parseInt(getStock(p) + amount)}</TableCell>
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
            <Button
                type="button"
                variant="contained"
                sx={{ width: '20%', margin: '0 auto', display: 'block', marginTop: 2 }}
                disabled={incomesByAmount.length === 0}
                onClick={e => handleSubmitIncomesByAmount(e)}
            >
                Guardar
            </Button>
        </Layout>
    )
}