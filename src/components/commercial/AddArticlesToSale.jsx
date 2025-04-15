/* eslint-disable react/prop-types */
import { useContext, useRef, useState } from "react";
import { Autocomplete, Box, Button, FormControl, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import CancelSharpIcon from '@mui/icons-material/CancelSharp';

import { AuthContext } from "../../providers/AuthProvider";

import { getArticleSalePrice, getStock } from "../../utils/helpers";

export function AddArticlesToSale({
    articles,
    saleArticles,
    setSaleArticles,
    missing,
    setMissing,
    idsToDelete,
    setIdsToDelete,
    open
}) {
    const { auth } = useContext(AuthContext);
    const [value, setValue] = useState('');
    const inputRefs = useRef({});
    const autocompleteRef = useRef(null);

    const handleAdd = data => {
        if (data.article_id.toString().length > 0) {
            setMissing(false);
            setSaleArticles([
                ...saleArticles.filter(sa => sa.article_id !== data.article_id),
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
            ...saleArticles.filter(sa => sa.article_id !== data.article_id),
            {
                ...saleArticles.find(sa => sa.article_id === data.article_id),
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

    const handleDeleteArticle = (saId, pId) => {
        setMissing(false);
        setSaleArticles(saleArticles.filter(sa => sa.article_id !== pId));
        if (open === 'EDIT' || open === 'CONVERT') {
            setIdsToDelete([...idsToDelete, saId]);
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
                            options={articles.filter(a => !saleArticles.map(sa => sa.article_id).includes(a?.id) && getStock(a) > 0)
                                .map(a => ({ label: `${a?.code} - ${a?.details}`, id: a?.id }))}
                            noOptionsText="No hay artículos disponibles."
                            onChange={(_, value) => handleAdd({ idx: saleArticles.length, article_id: value?.id ?? '' })}
                            renderInput={(params) => <TextField {...params} label="Artículo *" inputRef={autocompleteRef} />}
                            isOptionEqualToValue={(option, value) => option?.code === value?.code || value.length === 0}
                            onInputChange={(_, value) => setValue(value)}
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
                            {open !== 'VIEW' && <TableCell align="center">Stock</TableCell>}
                            <TableCell align="center">Total det.</TableCell>
                            {(open === 'NEW' || open === 'EDIT' || open === 'CONVERT') && <TableCell align="center"></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {saleArticles.length === 0 ?
                            <TableRow>
                                <TableCell align="center" colSpan={7}>No hay artículos agregados a esta venta.</TableCell>
                            </TableRow> :
                            saleArticles.map(sa => {
                                const a = articles.find(a => a?.id === sa.article_id);
                                const currentAmount = isNaN(parseInt(sa.amount)) ? 0 : parseInt(sa.amount);
                                const stock = getStock(a);
                                return (
                                    <TableRow key={sa.article_id}>
                                        <TableCell align="center">{a?.code}</TableCell>
                                        <TableCell align="center">{a?.details}</TableCell>
                                        <TableCell align="center">
                                            <FormControl>
                                                <TextField
                                                    type="number"
                                                    value={sa.amount}
                                                    disabled={open === 'VIEW' || (open === 'EDIT' && auth?.user.role !== 'ADMINISTRADOR')}
                                                    onChange={e => handleChangeAmount({ article_id: a?.id, amount: e.target.value })}
                                                    inputRef={el => inputRefs.current[sa.article_id] = el}
                                                    InputProps={{ inputProps: { max: open === 'NEW' ? stock : stock + parseInt(sa.amount), step: 1 } }}
                                                />
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>${getArticleSalePrice(sa.earn && sa.buy_price ? sa : a).toFixed(2)}</TableCell>
                                        {open !== 'VIEW' && <TableCell>{stock}</TableCell>}
                                        <TableCell>${(currentAmount * getArticleSalePrice(sa.earn && sa.buy_price ? sa : a)).toFixed(2)}</TableCell>
                                        {(open === 'NEW' || open === 'CONVERT' || (open === 'EDIT' && auth?.user.role === 'ADMINISTRADOR')) &&
                                            <TableCell align="center">
                                                <Button type="button" onClick={() => handleDeleteArticle(sa.id, a?.id)}>
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
