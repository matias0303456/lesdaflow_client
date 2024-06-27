import { Box, Button, FormControl, Input, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import { ModalComponent } from "../ModalComponent";

import { getStock } from "../../utils/helpers";

export function MovementsForm({
    open,
    setOpen,
    formData,
    errors,
    handleChange,
    reset,
    disabled,
    handleSubmit,
    products,
    setProducts
}) {

    const currentStock = getStock(products.find(p => p.id === parseInt(formData.product_id)))

    return (
        <ModalComponent open={open} onClose={() => reset(setOpen)} reduceWidth={600}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {`Nuevo ${formData.type} del producto: ${formData.code} - ${formData.details}`}
            </Typography>
            <form onChange={handleChange} onSubmit={async e => {
                const data = await handleSubmit(e)
                if (formData.type === 'ingreso') {
                    setProducts([
                        ...products.filter(p => p.id !== parseInt(formData.product_id)),
                        {
                            ...products.find(p => p.id === parseInt(formData.product_id)),
                            incomes: [
                                ...products.find(p => p.id === parseInt(formData.product_id)).incomes,
                                data
                            ]
                        }
                    ])
                }
                if (formData.type === 'egreso') {
                    setProducts([
                        ...products.filter(p => p.id !== parseInt(formData.product_id)),
                        {
                            ...products.find(p => p.id === parseInt(formData.product_id)),
                            outcomes: [
                                ...products.find(p => p.id === parseInt(formData.product_id)).outcomes,
                                data
                            ]
                        }
                    ])
                }
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                                            {currentStock}
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
                                            {formData.type === 'ingreso' && currentStock + Math.abs(parseInt(formData.amount ? formData.amount : 0))}
                                            {formData.type === 'egreso' && currentStock - Math.abs(parseInt(formData.amount ? formData.amount : 0))}
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