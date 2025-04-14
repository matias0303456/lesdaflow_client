/* eslint-disable react/prop-types */
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, Grid } from "@mui/material";
import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import { useState } from "react";

export function DiscountsAndSurcharges({
    title,
    entity,
    supplierEntities,
    setSupplierEntities,
    open
}) {
    const [newEntity, setNewEntity] = useState({
        name: '',
        value: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntity(prev => ({
            ...prev,
            [name]: name === 'value' ? Number(value) : value
        }));
    };

    const handleAddEntity = (e) => {
        e.preventDefault();
        if (newEntity.value !== '') {
            setSupplierEntities([...supplierEntities, newEntity]);
            setNewEntity({ name: '', value: '' });
        }
    };

    return (
        <Box sx={{ p: 1 }}>
            <Typography variant="h6">
                {title}
            </Typography>

            {(open === 'NEW' || open === 'EDIT') && (
                <Paper sx={{ p: 2, mb: 2 }}>
                    <form onSubmit={handleAddEntity}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={5}>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    name="name"
                                    value={newEntity.name}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <TextField
                                    fullWidth
                                    label="Valor (%)"
                                    name="value"
                                    type="number"
                                    value={newEntity.value}
                                    onChange={handleInputChange}
                                    required
                                    size="small"
                                    inputProps={{
                                        min: 0,
                                        step: 0.01
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Agregar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            )}

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">Valor (%)</TableCell>
                            {(open === 'NEW' || open === 'EDIT') && <TableCell align="center"></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {supplierEntities.length === 0 ?
                            <TableRow>
                                <TableCell colSpan={3} align="center">No hay {entity} asociados a este proveedor.</TableCell>
                            </TableRow> :
                            supplierEntities.map((se, idx) => {
                                return (
                                    <TableRow
                                        key={idx}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{se.name}</TableCell>
                                        <TableCell align="center">{se.value}</TableCell>
                                        {(open === 'NEW' || open === 'EDIT') &&
                                            <TableCell align="center">
                                                <Button
                                                    type="button"
                                                    onClick={() => setSupplierEntities(supplierEntities.filter((_, i) => i !== idx))}
                                                    sx={{ color: 'red' }}
                                                >
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
        </Box>
    )
}