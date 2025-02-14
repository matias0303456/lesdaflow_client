/* eslint-disable react/prop-types */
import { useContext } from "react"
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

import { DataContext } from "../../providers/DataProvider"
import { AuthContext } from "../../providers/AuthProvider"

import { AddProductsToSale } from "./AddProductsToSale"

import { getAvailableDiscounts, getCurrentSubtotal } from "../../utils/helpers"

export function SaleFormFields({
    handleChange,
    confirmed,
    handleSubmit,
    formData,
    setFormData,
    validate,
    reset,
    setDisabled,
    setConfirmed,
    errors,
    isBlocked,
    saleProducts,
    setSaleProducts,
    discountApplied,
    setDiscountApplied,
    missing,
    setMissing,
    idsToDelete,
    setIdsToDelete,
    currentTotal,
    handleClose,
    disabled,
    open
}) {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    return (
        <Box sx={{ p: 1 }}>
            <form onChange={handleChange} onSubmit={(e) => {
                e.preventDefault();
                if (confirmed) {
                    handleSubmit(e, formData, validate, reset, setDisabled)
                    setConfirmed(false)
                } else {
                    setConfirmed(true)
                }
            }
            }>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2
                    }}>
                        <FormControl sx={{ width: { xs: '100%', md: '60%' } }}>
                            <Autocomplete
                                disablePortal
                                id="client-autocomplete"
                                value={formData.client_id.toString().length > 0 ? `${state.clients.data.find(c => c.id === formData.client_id)?.first_name} ${state.clients.data.find(c => c.id === formData.client_id)?.last_name} (${state.clients.data.find(c => c.id === formData.client_id)?.work_place})` : ''}
                                options={state.clients.data.map(c => ({ label: `${c.first_name} ${c.last_name} (${c.work_place})`, id: c.id }))}
                                noOptionsText="No hay clientes registrados."
                                onChange={(e, value) => handleChange({ target: { name: 'client_id', value: value?.id ?? '' } })}
                                renderInput={(params) => <TextField {...params} label="Cliente *" />}
                                isOptionEqualToValue={(option, value) => option.code === value.code || value.length === 0}
                                disabled={open === 'VIEW' || (open === 'EDIT' && auth?.user.role !== 'ADMINISTRADOR')}
                            />
                            {errors.client_id?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El cliente es requerido.
                                </Typography>
                            }
                            {isBlocked &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * Este cliente está bloqueado.
                                </Typography>
                            }
                        </FormControl>
                        <Box sx={{ width: { xs: '100%', md: '40%' }, display: 'flex', justifyContent: 'space-around' }}>
                            <FormControlLabel
                                control={<Checkbox disabled={open === 'VIEW' || (open === 'EDIT' && auth?.user.role !== 'ADMINISTRADOR')} />}
                                label="Cuenta Corriente"
                                checked={formData.type === 'CUENTA_CORRIENTE'}
                                disabled={saleProducts.length > 0 && auth?.user.role !== 'ADMINISTRADOR' && formData.type !== 'CUENTA_CORRIENTE' && formData.type !== 'CONTADO'}
                                onChange={e => {
                                    if (e.target.checked) {
                                        setFormData({
                                            ...formData,
                                            type: 'CUENTA_CORRIENTE'
                                        })
                                        setDiscountApplied('')
                                    }
                                }}
                            />
                            <FormControlLabel
                                control={<Checkbox disabled={open === 'VIEW' || (open === 'EDIT' && auth?.user.role !== 'ADMINISTRADOR')} />}
                                label="Contado"
                                checked={formData.type === 'CONTADO'}
                                disabled={saleProducts.length > 0 && auth?.user.role !== 'ADMINISTRADOR' && formData.type !== 'CUENTA_CORRIENTE' && formData.type !== 'CONTADO'}
                                onChange={e => {
                                    if (e.target.checked) {
                                        setFormData({
                                            ...formData,
                                            type: 'CONTADO'
                                        })
                                    }
                                }}
                            />
                            <FormControlLabel
                                control={<Checkbox disabled={open === 'VIEW' || (open === 'EDIT' && auth?.user.role !== 'ADMINISTRADOR')} />}
                                label="Poxipol"
                                checked={formData.type === 'POXIPOL'}
                                disabled={saleProducts.length > 0 && auth?.user.role !== 'ADMINISTRADOR'}
                                onChange={e => {
                                    if (e.target.checked) {
                                        setFormData({
                                            ...formData,
                                            type: 'POXIPOL'
                                        })
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2
                    }}>
                        <AddProductsToSale
                            products={state.products.data}
                            saleProducts={saleProducts}
                            setSaleProducts={setSaleProducts}
                            missing={missing}
                            setMissing={setMissing}
                            idsToDelete={idsToDelete}
                            setIdsToDelete={setIdsToDelete}
                            open={open}
                            formData={formData}
                        />
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: { xs: '100%', md: '40%' },
                            gap: 3
                        }}>
                            <FormControl>
                                <InputLabel>Descuento</InputLabel>
                                <Select
                                    labelId="discount-select"
                                    id="discount"
                                    value={discountApplied.id ?? ''}
                                    disabled={formData.type === 'POXIPOL' || open === 'VIEW' || (open === 'EDIT' && auth?.user.role !== 'ADMINISTRADOR')}
                                    label="Descuento"
                                    name="discount"
                                    onChange={(e) => setDiscountApplied(state.discounts.data.find(d => d.id === e.target.value))}
                                    sx={{ width: "100%" }}
                                >
                                    <MenuItem value="">Ninguno</MenuItem>
                                    {getAvailableDiscounts(formData, saleProducts, state.products.data, state.discounts.data)
                                        .map(d => (
                                            <MenuItem key={d.id} value={d.id}>
                                                {d.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                                {discountApplied?.base > 0 && discountApplied?.base < currentTotal &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El monto neto debe ser mayor o igual a la base del descuento: ${discountApplied.base}.
                                    </Typography>
                                }
                            </FormControl>
                            <FormControl>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                    <DatePicker
                                        label="Fecha"
                                        value={new Date(formData.date)}
                                        onChange={value => handleChange({
                                            target: {
                                                name: 'date',
                                                value: new Date(value.toISOString())
                                            }
                                        })}
                                        disabled={open === 'VIEW' || (open === 'EDIT' && auth?.user.role !== 'ADMINISTRADOR')}
                                    />
                                </LocalizationProvider>
                                {errors.date?.type === 'required' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * La fecha es requerida.
                                    </Typography>
                                }
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: 3 }}>
                    <FormControl>
                        <InputLabel htmlFor="subtotal">Subtotal</InputLabel>
                        <Input value={getCurrentSubtotal(saleProducts, state.products.data)} id="subtotal" type="number" name="subtotal" disabled />
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="total">Total</InputLabel>
                        <Input value={currentTotal} id="total" type="number" name="total" disabled />
                    </FormControl>
                </Box>
                {confirmed &&
                    <Typography variant="body1" color="red" marginTop={2} align="center">
                        Confirme los datos de la venta antes de guardar
                    </Typography>
                }
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
                        {open === 'VIEW' || (open === 'EDIT' && auth?.user.role !== 'ADMINISTRADOR') ? 'Cerrar' : 'Cancelar'}
                    </Button>
                    {(open === 'NEW' || open === 'CONVERT' || (open === 'EDIT' && auth?.user.role === 'ADMINISTRADOR')) &&
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={
                                disabled ||
                                (discountApplied?.base > 0 && discountApplied?.base < currentTotal) ||
                                (isBlocked && (open === 'NEW' || open === 'CONVERT'))
                            }
                            sx={{ width: '50%' }}
                        >
                            {confirmed ? 'Guardar' : 'Confirmar'}
                        </Button>
                    }
                </FormControl>
            </form>
        </Box>
    )
}