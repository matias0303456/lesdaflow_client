/* eslint-disable react/prop-types */
import { useState } from "react";
import { Autocomplete, Box, Button, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";

export function AddSuppliersToDiscount({ suppliers, discountSuppliers, setDiscountSuppliers, open }) {

    const [value, setValue] = useState('')

    const handleAdd = sId => {
        if (sId.toString().length > 0) {
            setDiscountSuppliers([...discountSuppliers.filter(ds => ds !== sId), sId])
        }
    }

    const handleDelete = (sId) => setDiscountSuppliers(discountSuppliers.filter(ds => {
        return sId !== (ds.supplier?.id ?? ds)
    }))

    return (
        <Box>
            {open !== 'VIEW' &&
                <FormControl sx={{ width: { xs: '100%', sm: '25%' } }}>
                    <Autocomplete
                        disablePortal
                        id="article-autocomplete"
                        options={suppliers.filter(s => !discountSuppliers.map(ds => ds.supplier_id).includes(s.id))
                            .map(s => ({ label: s.name, id: s.id }))}
                        noOptionsText="No hay proveedores disponibles."
                        onChange={(_, value) => handleAdd(value?.id ?? '')}
                        renderInput={(params) => <TextField {...params} label="Agregar proveedor..." />}
                        isOptionEqualToValue={(option, value) => option.code === value.code || value.length === 0}
                        onInputChange={(_, value) => setValue(value)}
                        value={value}
                        onBlur={() => setValue('')}
                    />
                </FormControl>
            }
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nombre</TableCell>
                            {open !== 'VIEW' && <TableCell align="center"></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {discountSuppliers.length === 0 ?
                            <TableRow>
                                <TableCell colSpan={4} align="center">No hay proveedores agregados.</TableCell>
                            </TableRow> :
                            discountSuppliers.map((ds) => {
                                const s = suppliers.find(s => s.id === (ds.supplier?.id ?? ds))
                                return (
                                    <TableRow key={s.id}>
                                        <TableCell align="center">{s.name}</TableCell>
                                        {open !== 'VIEW' &&
                                            <TableCell align="center">
                                                <Button
                                                    variant="outlined"
                                                    size="sm"
                                                    onClick={() => handleDelete(s.id)}
                                                >
                                                    Eliminar
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