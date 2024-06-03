import { useState } from "react";
import { Autocomplete, Box, Button, FormControl, Input, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";

import { ModalComponent } from "../common/ModalComponent";

export function MovementsForm({
    movementType,
    formData,
    errors,
    handleChange,
    handleSubmit,
    reset, setOpen
}) {

    const [search, setSearch] = useState([])

    return (
        <ModalComponent open={open === 'NEW_INCOME' || open === 'NEW__OUTCOME'} onClose={() => reset(setOpen)} reduceWidth={600}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {`Nuevo ${movementType}`}
            </Typography>
            <form onChange={handleChange} onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl>
                        <Autocomplete
                            disablePortal
                            id="product-autocomplete"
                            value={formData.product_id.toString() > 0 ? `${search.find(p => p.id === formData.product_id)?.code} - ${search.find(p => p.id === formData.product_id)?.details}` : ''}
                            options={search.map(p => ({ label: `Cód: ${p.code} - Det: ${p.details}`, id: p.id }))}
                            noOptionsText="Buscar producto por código o nombre..."
                            onChange={(e, value) => handleChange({ target: { name: 'product_id', value: value?.id ?? '' } })}
                            renderInput={(params) => <TextField {...params} label="Producto" />}
                            isOptionEqualToValue={(option, value) => option.code === value.code || value.length === 0}
                        />
                        {errors.product_id?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El producto es requerido.
                            </Typography>
                        }
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            Stock actual
                                        </TableCell>
                                        <TableCell align="center">
                                            Cantidad
                                        </TableCell>
                                        <TableCell align="center">
                                            Nuevo stock
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center">
                                            {formData.product_id.toString().length > 0 ? search.find(p => p.id === formData.product_id)?.stock : 0}
                                        </TableCell>
                                        <TableCell align="center">
                                            <FormControl>
                                                <Input id="amount" type="number" name="amount" value={formData.amount} />
                                                {errors.amount?.type === 'required' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * La cantidad es requerida.
                                                    </Typography>
                                                }
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="center">
                                            {formData.product_id.toString().length > 0 ? search.find(p => p.id === formData.product_id)?.stock + Math.abs(parseInt(formData.amount.toString().length > 0 ? formData.amount : 0)) - oldFormDataAmount : 0}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    <FormControl>
                        <InputLabel htmlFor="observations">Observaciones</InputLabel>
                        <Input id="observations" type="text" name="observations" value={formData.observations} />
                        {errors.observations?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Las observaciones son demasiado largas.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        justifyContent: 'center',
                        margin: '0 auto',
                        marginTop: 1,
                        width: '50%'
                    }}>
                        <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{
                            width: '50%'
                        }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="contained" disabled={disabled} sx={{
                            width: '50%'
                        }}>
                            Guardar
                        </Button>
                    </FormControl>
                </Box>
            </form>
        </ModalComponent>
    )
}