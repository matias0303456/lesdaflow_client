/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Box, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";

export function ArticleForm({
    handleChange,
    errors,
    formData,
    open
}) {

    const { state } = useContext(DataContext)

    return (
        <form onChange={handleChange}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    <FormControl sx={{ width: '50%' }}>
                        <InputLabel htmlFor="code">Código *</InputLabel>
                        <Input id="code" type="text" name="code" value={formData.code} disabled={open === 'VIEW'} />
                        {errors.code?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El código es requerido.
                            </Typography>
                        }
                        {errors.code?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El código es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: '50%' }}>
                        <InputLabel htmlFor="details">Nombre Artículo *</InputLabel>
                        <Input id="details" type="text" name="details" value={formData.details} disabled={open === 'VIEW'} />
                        {errors.details?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre es requerido.
                            </Typography>
                        }
                        {errors.details?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    <FormControl sx={{ width: '50%' }}>
                        <TextField
                            type="number"
                            name="buy_price"
                            label="Precio de compra"
                            value={formData.buy_price}
                            disabled={open === 'VIEW'}
                            InputProps={{ inputProps: { step: 0.01 } }}
                        />
                    </FormControl>
                    <FormControl sx={{ width: '50%' }}>
                        <TextField
                            type="number"
                            name="earn"
                            label="% Gan."
                            value={formData.earn}
                            disabled={open === 'VIEW'}
                            InputProps={{ inputProps: { step: 0.01 } }}
                        />
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    <FormControl sx={{ width: '50%' }}>
                        <InputLabel id="supplier-select">Proveedor *</InputLabel>
                        <Select
                            labelId="supplier-select"
                            id="supplier_id"
                            value={formData.supplier_id}
                            label="Proveedor"
                            name="supplier_id"
                            onChange={handleChange}
                            disabled={open === 'VIEW'}
                        >
                            {state.suppliers.map(s => (
                                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                            ))}
                        </Select>
                        {errors.supplier_id?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El proveedor es requerido.
                            </Typography>
                        }
                    </FormControl>
                    {open === 'NEW' &&
                        <FormControl sx={{ width: '50%' }}>
                            <TextField
                                type="number"
                                name="amount"
                                label="Stock inicial"
                                value={formData.amount}
                                InputProps={{ inputProps: { step: 1 } }}
                            />
                        </FormControl>
                    }
                    {(open === 'VIEW' || open === 'EDIT') &&
                        <FormControl sx={{ width: '50%' }}>
                            <TextField
                                label="Precio de venta"
                                disabled
                                value={formData.sale_price}
                            />
                        </FormControl>
                    }
                </Box>
            </Box>
        </form>
    )
}