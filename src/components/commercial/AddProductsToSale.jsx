/* eslint-disable react/prop-types */
import { useContext, useRef, useState } from "react";
import { Autocomplete, Box, Button, FormControl, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import CancelSharpIcon from '@mui/icons-material/CancelSharp';

import { AuthContext } from "../../providers/AuthProvider";

import { getArticleSalePrice, getStock } from "../../utils/helpers";

export function AddProductsToSale({
    products,
    saleProducts,
    setSaleArticles,
    missing,
    setMissing,
    idsToDelete,
    setIdsToDelete,
    open,
    formData
}) {
    const { auth } = useContext(AuthContext);
    const [value, setValue] = useState('');
    const inputRefs = useRef({});
    const autocompleteRef = useRef(null);

    const handleAdd = data => {
        if (data.article_id.toString().length > 0) {
            setMissing(false);
            setSaleArticles([
                ...saleProducts.filter(sp => sp.article_id !== data.article_id),
                data
            ]);

            setTimeout(() => {
                if (inputRefs.current[data.article_id]) {
                    inputRefs.current[data.article_id].focus();
                }
            }, 100);
        }
    };

    const handleChangeAmount = data => {
        const amount = data.amount.toString().length > 0 ? data.amount : 0;
        setSaleArticles([
            ...saleProducts.filter(sp => sp.article_id !== data.article_id),
            {
                ...saleProducts.find(sp => sp.article_id === data.article_id),
                ...data,
                amount
            }
        ].sort((a, b) => open === 'NEW' ? a.idx - b.idx : a.id - b.id));

        setTimeout(() => {
            if (autocompleteRef.current) {
                autocompleteRef.current.focus();
            }
        }, 1000);
    };

    const handleDeleteProduct = (spId, pId) => {
        setMissing(false);
        setSaleArticles(saleProducts.filter(sp => sp.article_id !== pId));
        if (open === 'EDIT' || open === 'CONVERT') {
            setIdsToDelete([...idsToDelete, spId]);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', md: '60%' } }}>
            {(open === 'NEW' || (open === 'EDIT' && auth?.user.role === 'ADMINISTRADOR')) &&
                <>
                    <FormControl>
                        <Autocomplete
                            disablePortal
                            id="article-autocomplete"
                            options={products.filter(p => {
                                return !saleProducts.map(sp => sp.article_id).includes(p?.id) && getStock(p) > 0 &&
                                    (
                                        (formData.type === 'CONTADO' && p?.cash) ||
                                        (formData.type === 'CUENTA_CORRIENTE' && p?.cta_cte) ||
                                        (formData.type === 'POXIPOL' && p?.poxipol)
                                    );
                            })
                                .map(p => ({ label: `${p?.code} - ${p?.details}`, id: p?.id }))}
                            noOptionsText="No hay productos disponibles."
                            onChange={(_, value) => handleAdd({ idx: saleProducts.length, article_id: value?.id ?? '' })}
                            renderInput={(params) => <TextField {...params} label="Producto *" inputRef={autocompleteRef} />}
                            isOptionEqualToValue={(option, value) => option?.code === value?.code || value.length === 0}
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
                </>
            }
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Código</TableCell>
                            <TableCell align="center">Detalle</TableCell>
                            <TableCell align="center">Cantidad</TableCell>
                            <TableCell align="center">Precio</TableCell>
                            {open !== 'VIEW' && <TableCell align="center">Stock</TableCell>}
                            <TableCell align="center">Total det.</TableCell>
                            {(open === 'NEW' || open === 'EDIT' || open === 'CONVERT') && <TableCell align="center"></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {saleProducts.length === 0 ?
                            <TableRow>
                                <TableCell align="center" colSpan={7}>No hay productos agregados a esta venta.</TableCell>
                            </TableRow> :
                            saleProducts.map(sp => {
                                const p = products.find(p => p?.id === sp.article_id);
                                const currentAmount = isNaN(parseInt(sp.amount)) ? 0 : parseInt(sp.amount);
                                const stock = getStock(p);
                                return (
                                    <TableRow key={sp.article_id}>
                                        <TableCell align="center">{p?.code}</TableCell>
                                        <TableCell align="center">{p?.details}</TableCell>
                                        <TableCell align="center">
                                            <FormControl>
                                                <TextField
                                                    type="number"
                                                    value={sp.amount}
                                                    disabled={open === 'VIEW' || (open === 'EDIT' && auth?.user.role !== 'ADMINISTRADOR')}
                                                    onChange={e => handleChangeAmount({ article_id: p?.id, amount: e.target.value })}
                                                    inputRef={el => inputRefs.current[sp.article_id] = el}
                                                    InputProps={{ inputProps: { max: open === 'NEW' ? stock : stock + parseInt(sp.amount), step: 1 } }}
                                                />
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>${getArticleSalePrice(sp.earn && sp.buy_price ? sp : p).toFixed(2)}</TableCell>
                                        {open !== 'VIEW' && <TableCell>{stock}</TableCell>}
                                        <TableCell>${(currentAmount * getArticleSalePrice(sp.earn && sp.buy_price ? sp : p)).toFixed(2)}</TableCell>
                                        {(open === 'NEW' || open === 'CONVERT' || (open === 'EDIT' && auth?.user.role === 'ADMINISTRADOR')) &&
                                            <TableCell align="center">
                                                <Button type="button" onClick={() => handleDeleteProduct(sp.id, p?.id)}>
                                                    <CancelSharpIcon />
                                                </Button>
                                            </TableCell>
                                        }
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
