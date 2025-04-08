/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { Autocomplete, Button, FormControl, Input, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import CancelSharpIcon from '@mui/icons-material/CancelSharp';

import { getArticleSalePrice, getStock } from "../../utils/helpers";

export function AddArticlesToBudget({
    articles,
    budgetArticles,
    setBudgetArticles,
    idsToDelete,
    setIdsToDelete,
    open,
    missing,
    setMissing
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

    const handleDeleteArticle = (bpId, pId) => {
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
                            options={articles.filter(a =>
                                !budgetArticles.map(ba => ba.article_id).includes(a.id))
                                .map(a => ({ label: `Código ${a.code} / Detalle ${a.details}`, id: a.id }))}
                            noOptionsText="No hay artículos disponibles."
                            onChange={(e, value) => handleAdd({ idx: budgetArticles.length, article_id: value?.id ?? '' })}
                            renderInput={(params) => <TextField {...params} label="Artículo *" />}
                            isOptionEqualToValue={(option, value) => option.code === value.code || value.length === 0}
                            onInputChange={(e, value) => setValue(value)}
                            value={value}
                            onBlur={() => setValue('')}
                        />
                    </FormControl>
                    {missing &&
                        <Typography variant="caption" color="red" marginTop={1}>
                            * Los artículos y las cantidades son requeridos y las cantidades deben ser mayores a 0.
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
                                <TableCell align="center">No hay artículos agregados a esta venta.</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow> :
                            budgetArticles.map(ba => {
                                const a = articles.find(a => a.id === ba.article_id)
                                const currentAmount = isNaN(parseInt(ba.amount)) ? 0 : parseInt(ba.amount)
                                return (
                                    <TableRow
                                        key={ba.article_id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{a.code}</TableCell>
                                        <TableCell align="center">{a.details}</TableCell>
                                        <TableCell align="center">
                                            <Input
                                                type="number"
                                                value={ba.amount}
                                                disabled={open === 'VIEW'}
                                                onChange={e => handleChangeAmount({
                                                    article_id: a.id,
                                                    amount: e.target.value
                                                })}
                                                inputRef={el => inputRefs.current[ba.article_id] = el}
                                            />
                                        </TableCell>
                                        <TableCell>${getArticleSalePrice(a).toFixed(2)}</TableCell>
                                        <TableCell>{getStock(a)}</TableCell>
                                        <TableCell>${(currentAmount * getArticleSalePrice(a)).toFixed(2)}</TableCell>
                                        {(open === 'NEW' || open === 'EDIT') &&
                                            <TableCell align="center">
                                                <Button type="button" onClick={() => handleDeleteArticle(ba.id, a.id)}>
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