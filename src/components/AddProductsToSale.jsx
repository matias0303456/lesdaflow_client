import { Autocomplete, Box, Button, FormControl, Input, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import CancelSharpIcon from '@mui/icons-material/CancelSharp';

export function AddProductsToSale({
    products,
    saleProducts,
    setSaleProducts,
    productsRequired,
    setProductsRequired
}) {

    const handleAdd = data => {
        if (data.product_id.toString().length > 0) {
            setProductsRequired(false)
            setSaleProducts([
                ...saleProducts.filter(sp => sp.product_id !== data.product_id),
                data
            ])
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
            ])
        }
    }

    const handleDeleteProduct = id => {
        setProductsRequired(false)
        setSaleProducts([
            ...saleProducts.filter(sp => sp.product_id !== id),
        ])
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 3 }}>
            <FormControl>
                <Autocomplete
                    disablePortal
                    id="product-autocomplete"
                    options={products.filter(p =>
                        !saleProducts.map(sp => sp.product_id).includes(p.id))
                        .map(p => ({ label: `${p.code} - ${p.details}`, id: p.id }))}
                    noOptionsText="No hay productos disponibles."
                    onChange={(e, value) => handleAdd({ product_id: value?.id ?? '' })}
                    renderInput={(params) => <TextField {...params} label="Producto" />}
                    isOptionEqualToValue={(option, value) => option.code === value.code || value.length === 0}
                />
            </FormControl>
            {productsRequired &&
                <Typography variant="caption" color="red" marginTop={1}>
                    * Los productos son requeridos.
                </Typography>
            }
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Código</TableCell>
                            <TableCell align="center">Detalle</TableCell>
                            <TableCell align="center">Cantidad</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {saleProducts.length === 0 ?
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="center">No hay productos agregados a esta venta.</TableCell>
                                <TableCell></TableCell>
                            </TableRow> :
                            saleProducts.map(sp => {
                                const p = products.find(p => p.id === sp.product_id)
                                return (
                                    <TableRow
                                        key={sp.product_id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{p.code}</TableCell>
                                        <TableCell align="center">{p.details}</TableCell>
                                        <TableCell align="center">
                                            <Input type="number" value={sp.amount} onChange={e => handleChangeAmount({
                                                product_id: p.id,
                                                amount: e.target.value
                                            })} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button type="button" onClick={() => handleDeleteProduct(p.id)}>
                                                <CancelSharpIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}