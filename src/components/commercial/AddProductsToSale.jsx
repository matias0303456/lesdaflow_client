import { useState } from "react";
import { Autocomplete, Button, FormControl, Input, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import CancelSharpIcon from '@mui/icons-material/CancelSharp';

export function AddProductsToSale({
    searchProducts,
    saleProducts,
    setSaleProducts,
    missing,
    setMissing,
    idsToDelete,
    setIdsToDelete,
    open
}) {

    const [value, setValue] = useState('')

    const handleAdd = data => {
        if (data.product_id.toString().length > 0) {
            setMissing(false)
            setSaleProducts([
                ...saleProducts.filter(sp => sp.product_id !== data.product_id),
                data
            ])
            setTimeout(() => {
                setValue('')
            }, 1000)
        }
    }

    const handleChangeAmount = data => {
        if (data.amount.toString().length > 0) {
            setSaleProducts([
                ...saleProducts.filter(sp => sp.product_id !== data.product_id),
                {
                    ...saleProducts.find(sp => sp.product_id === data.product_id),
                    ...data
                }
            ].sort((a, b) => open === 'NEW' ? a.idx - b.idx : a.id - b.id))
        }
    }

    const handleDeleteProduct = (spId, pId) => {
        setMissing(false)
        setSaleProducts([
            ...saleProducts.filter(sp => sp.product_id !== pId),
        ])
        if (open === 'EDIT') {
            setIdsToDelete([...idsToDelete, spId])
        }
    }

    return (
        <>
            <FormControl>
                <Autocomplete
                    disablePortal
                    id="product-autocomplete"
                    options={searchProducts.filter(p =>
                        !saleProducts.map(sp => sp.product_id).includes(p.id))
                        .map(p => ({ label: `Código ${p.code} / Detalle ${p.details} / Talle ${p.size}`, id: p.id }))}
                    noOptionsText="No hay productos disponibles."
                    onChange={(e, value) => handleAdd({ idx: saleProducts.length, product_id: value?.id ?? '', amount: 1 })}
                    renderInput={(params) => <TextField {...params} label="Producto" />}
                    isOptionEqualToValue={(option, value) => option.code === value.code || value.length === 0}
                    onInputChange={(e, value) => setValue(value)}
                    value={value}
                    onBlur={() => setValue('')}
                />
            </FormControl>
            {missing &&
                <Typography variant="caption" color="red" marginTop={1}>
                    * Los productos y las cantidades son requeridos y las cantidades deben ser mayores a 0.
                </Typography>
            }
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Código</TableCell>
                            <TableCell align="center">Detalle</TableCell>
                            <TableCell align="center">Talle</TableCell>
                            <TableCell align="center">Cantidad</TableCell>
                            <TableCell align="center">Precio</TableCell>
                            <TableCell align="center">Stock</TableCell>
                            <TableCell align="center">Total det.</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {saleProducts.length === 0 ?
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="center">No hay productos agregados a esta venta.</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow> :
                            searchProducts.length === 0 ?
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="center">Cargando productos...</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow> :
                                saleProducts.map(sp => {
                                    const p = searchProducts.find(p => p.id === sp.product_id)
                                    return (
                                        <TableRow
                                            key={sp.product_id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{p?.code}</TableCell>
                                            <TableCell align="center">{p?.details}</TableCell>
                                            <TableCell align="center">{p?.size}</TableCell>
                                            <TableCell align="center">
                                                <Input type="number" value={sp.amount} onChange={e => handleChangeAmount({
                                                    product_id: p.id,
                                                    amount: e.target.value
                                                })} />
                                            </TableCell>
                                            <TableCell>${((sp.buy_price ?? p?.buy_price) + (((sp.buy_price ?? p?.buy_price) / 100) * (sp.earn ?? p?.earn))).toFixed(2)}</TableCell>
                                            <TableCell>{p?.stock}</TableCell>
                                            <TableCell>${(sp.amount * ((sp.buy_price ?? p?.buy_price) + (((sp.buy_price ?? p?.buy_price) / 100) * (sp.earn ?? p?.earn)))).toFixed(2)}</TableCell>
                                            <TableCell align="center">
                                                <Button type="button" onClick={() => handleDeleteProduct(sp.id, p?.id)}>
                                                    <CancelSharpIcon />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}