/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { Autocomplete, Button, FormControl, Input, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import CancelSharpIcon from '@mui/icons-material/CancelSharp';

import { getArticleSalePrice, getStock } from "../../utils/helpers";

export function AddArticlesToBudget({
    products,
    budgetArticles,
    setBudgetArticles,
    idsToDelete,
    setIdsToDelete,
    open,
    missing,
    setMissing,
    formData
}) {

    const [value, setValue] = useState('')

    const inputRefs = useRef({});

    const handleAdd = data => {
        if (data.article_id.toString().length > 0) {
            setMissing(false)
            setBudgetArticles([
                ...budgetArticles.filter(bp => bp.article_id !== data.article_id),
                data
            ])

            setTimeout(() => {
                if (inputRefs.current[data.article_id]) {
                    inputRefs.current[data.article_id].focus();
                }
            }, 100);
        }
    }

    const handleChangeAmount = data => {
        setBudgetArticles([
            ...budgetArticles.filter(bp => bp.article_id !== data.article_id),
            {
                ...budgetArticles.find(bp => bp.article_id === data.article_id),
                ...data,
                amount: data.amount.toString().length > 0 ? data.amount : 0
            }
        ].sort((a, b) => open === 'NEW' ? a.idx - b.idx : a.id - b.id))
    }

    const handleDeleteProduct = (bpId, pId) => {
        setMissing(false)
        setBudgetArticles([
            ...budgetArticles.filter(bp => bp.article_id !== pId),
        ])
        if (open === 'EDIT') {
            setIdsToDelete([...idsToDelete, bpId])
        }
    }

    return (
        <>
            {(open === 'NEW' || open === 'EDIT') &&
                <>
                    <FormControl>
                        <Autocomplete
                            disablePortal
                            id="article-autocomplete"
                            options={products.filter(p =>
                                !budgetArticles.map(bp => bp.article_id).includes(p.id) &&
                                (
                                    (formData.type === 'CONTADO' && p?.cash) ||
                                    (formData.type === 'CUENTA_CORRIENTE' && p?.cta_cte) ||
                                    (formData.type === 'POXIPOL' && p?.poxipol)
                                ))
                                .map(p => ({ label: `Código ${p.code} / Detalle ${p.details}`, id: p.id }))}
                            noOptionsText="No hay productos disponibles."
                            onChange={(e, value) => handleAdd({ idx: budgetArticles.length, article_id: value?.id ?? '' })}
                            renderInput={(params) => <TextField {...params} label="Producto *" />}
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
                            <TableCell align="center">Stock</TableCell>
                            <TableCell align="center">Total det.</TableCell>
                            {(open === 'NEW' || open === 'EDIT') && <TableCell align="center"></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {budgetArticles.length === 0 ?
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="center">No hay productos agregados a esta venta.</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow> :
                            budgetArticles.map(bp => {
                                const p = products.find(p => p.id === bp.article_id)
                                const currentAmount = isNaN(parseInt(bp.amount)) ? 0 : parseInt(bp.amount)
                                return (
                                    <TableRow
                                        key={bp.article_id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{p.code}</TableCell>
                                        <TableCell align="center">{p.details}</TableCell>
                                        <TableCell align="center">
                                            <Input
                                                type="number"
                                                value={bp.amount}
                                                disabled={open === 'VIEW'}
                                                onChange={e => handleChangeAmount({
                                                    article_id: p.id,
                                                    amount: e.target.value
                                                })}
                                                inputRef={el => inputRefs.current[bp.article_id] = el}
                                            />
                                        </TableCell>
                                        <TableCell>${getArticleSalePrice(p).toFixed(2)}</TableCell>
                                        <TableCell>{getStock(p)}</TableCell>
                                        <TableCell>${(currentAmount * getArticleSalePrice(p)).toFixed(2)}</TableCell>
                                        {(open === 'NEW' || open === 'EDIT') &&
                                            <TableCell align="center">
                                                <Button type="button" onClick={() => handleDeleteProduct(bp.id, p.id)}>
                                                    <CancelSharpIcon />
                                                </Button>
                                            </TableCell>
                                        }
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}