import { Box, Button, FormControl, Input, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import { ModalComponent } from "../common/ModalComponent";
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
    validate,
    setDisabled,
}) {
    return (
        <ModalComponent open={open} onClose={() => reset(setOpen)} reduceWidth={600}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {open === 'NEW_INCOME' && `Nuevo ingreso del producto: ${formData.code} - ${formData.details}`}
                {open === 'NEW_OUTCOME' && `Nuevo egreso del producto: ${formData.code} - ${formData.details}`}
            </Typography>
            <form onChange={handleChange} onSubmit={e => handleSubmit(e, validate, formData, setDisabled, reset)}>
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
                                            {getStock(formData)}
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
                                            {open === 'NEW_INCOME' && getStock(formData) + Math.abs(parseInt(formData.amount ? formData.amount : 0))}
                                            {open === 'NEW_OUTCOME' && getStock(formData) - Math.abs(parseInt(formData.amount ? formData.amount : 0))}
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