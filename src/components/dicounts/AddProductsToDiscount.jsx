/* eslint-disable react/prop-types */
import { useState } from "react";
import { Autocomplete, Box, Button, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";

export function AddProductsToDiscount({ products, discountProducts, setDiscountProducts, open }) {

    const [value, setValue] = useState('')

    const handleAdd = pId => {
        if (pId.toString().length > 0) {
            setDiscountProducts([...discountProducts.filter(dp => dp !== pId), pId])
        }
    }

    const handleDelete = (pId) => setDiscountProducts(discountProducts.filter(dp => {
        return pId !== (dp.product?.id ?? dp)
    }))

    return (
        <Box>
            {open !== 'VIEW' &&
                <FormControl sx={{ width: { xs: '100%', sm: '25%' } }}>
                    <Autocomplete
                        disablePortal
                        id="product-autocomplete"
                        options={products.filter(p => !discountProducts.map(dp => dp.product_id).includes(p.id))
                            .map(p => ({ label: `Código ${p.code} / Detalle ${p.details}`, id: p.id }))}
                        noOptionsText="No hay productos disponibles."
                        onChange={(_, value) => handleAdd(value?.id ?? '')}
                        renderInput={(params) => <TextField {...params} label="Agregar producto..." />}
                        isOptionEqualToValue={(option, value) => option.code === value.code || value.length === 0}
                        onInputChange={(_, value) => setValue(value)}
                        value={value}
                        onBlur={() => setValue('')}
                    />
                </FormControl>
            }
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Código</TableCell>
                            <TableCell align="center">Detalle</TableCell>
                            <TableCell align="center">Proveedor</TableCell>
                            {open !== 'VIEW' && <TableCell align="center"></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {discountProducts.length === 0 ?
                            <TableRow>
                                <TableCell colSpan={4} align="center">No hay productos agregados.</TableCell>
                            </TableRow> :
                            discountProducts.map((dp) => {
                                const p = products.find(p => p.id === (dp.product?.id ?? dp))
                                return (
                                    <TableRow key={p.id}>
                                        <TableCell align="center">{p.code}</TableCell>
                                        <TableCell align="center">{p.details}</TableCell>
                                        <TableCell align="center">{p.supplier.name}</TableCell>
                                        {open !== 'VIEW' &&
                                            <TableCell align="center">
                                                <Button
                                                    variant="outlined"
                                                    size="sm"
                                                    onClick={() => handleDelete(p.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </TableCell>
                                        }
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}