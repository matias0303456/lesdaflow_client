/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { DataContext } from "../../providers/DataProvider";
import { AddProductsToDiscount } from "./AddProductsToDiscount";

export function DiscountForm({
    handleChange,
    handleSubmit,
    validate,
    formData,
    setFormData,
    reset,
    disabled,
    setDisabled,
    errors,
    open,
    handleClose,
    discountProducts,
    setDiscountProducts,
    products
}) {

    const { state } = useContext(DataContext)

    return (
        <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, validate, formData, reset, setDisabled)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl>
                    <InputLabel htmlFor="name">Nombre *</InputLabel>
                    <Input id="name" type="text" name="name" value={formData.name} disabled={open === 'VIEW'} />
                    {errors.name?.type === 'required' &&
                        <Typography variant="caption" color="red" marginTop={1}>
                            * El nombre es requerido.
                        </Typography>
                    }
                    {errors.name?.type === 'maxLength' &&
                        <Typography variant="caption" color="red" marginTop={1}>
                            * El nombre es demasiado largo.
                        </Typography>
                    }
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: { xs: 1, sm: 3 } }}>
                    <FormControl sx={{ width: '33%' }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Desde"
                                value={new Date(formData.from)}
                                onChange={value => handleChange({
                                    target: {
                                        name: 'from',
                                        value: new Date(value.toISOString())
                                    }
                                })}
                                disabled={open === 'VIEW' || formData.no_date_limit}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <FormControl sx={{ width: '33%' }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Hasta"
                                value={new Date(formData.to)}
                                onChange={value => handleChange({
                                    target: {
                                        name: 'to',
                                        value: new Date(value.toISOString())
                                    }
                                })}
                                disabled={open === 'VIEW' || formData.no_date_limit}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <FormControlLabel
                        sx={{ width: '33%' }}
                        control={<Checkbox disabled={open === 'VIEW'} />}
                        label="Sin límite"
                        checked={formData.no_date_limit}
                        disabled={open === 'VIEW'}
                        onChange={e => setFormData({
                            ...formData,
                            no_date_limit: e.target.checked
                        })}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: { xs: 1, sm: 3 } }}>
                    <FormControl sx={{ width: '33%' }}>
                        <TextField
                            type="number"
                            label="Tasa (%) *"
                            variant="outlined"
                            id="value"
                            name="value"
                            value={formData.value}
                            disabled={open === 'VIEW'}
                            InputProps={{ inputProps: { min: 0.01, step: 0.01 } }}
                        />
                    </FormControl>
                    <FormControl sx={{ width: '33%' }}>
                        <TextField
                            type="number"
                            label="Base"
                            variant="outlined"
                            id="base"
                            name="base"
                            value={formData.base}
                            disabled={open === 'VIEW'}
                            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                        />
                    </FormControl>
                    <FormControl sx={{ width: '33%' }}>
                        <InputLabel id="supplier-select">Proveedor</InputLabel>
                        <Select
                            labelId="supplier-select"
                            id="supplier_id"
                            value={formData.supplier_id ?? ''}
                            label="Proveedor"
                            name="supplier_id"
                            onChange={handleChange}
                            disabled={open === 'VIEW'}
                        >
                            {state.suppliers.data.map(s => (
                                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <AddProductsToDiscount
                    discountProducts={discountProducts}
                    setDiscountProducts={setDiscountProducts}
                    products={products}
                    open={open}
                />
                <FormControl sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    justifyContent: 'center',
                    margin: '0 auto',
                    marginTop: 3,
                    width: '50%'
                }}>
                    <Button type="button" variant="outlined" onClick={handleClose} sx={{ width: '50%' }}>
                        {open === 'VIEW' ? 'Cerrar' : 'Cancelar'}
                    </Button>
                    {(open === 'NEW' || open === 'EDIT') &&
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={disabled || isNaN(parseFloat(formData.value)) || parseFloat(formData.value) < 0.01}
                            sx={{ width: '50%' }}
                        >
                            Confirmar
                        </Button>
                    }
                </FormControl>
            </Box>
        </form>
    )
}