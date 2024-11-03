/* eslint-disable react/prop-types */
import { useContext, useEffect } from "react"
import { Autocomplete, Box, FormControl, InputLabel, TextField, Typography, Input, Button, FormControlLabel, Checkbox } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

import { DataContext } from "../../providers/DataProvider"

import { AddProductsToBudget } from "./AddProductsToBudget"
import { ModalComponent } from "../common/ModalComponent"

import { getBudgetSubtotal, getBudgetTotal } from "../../utils/helpers"

export function BudgetForm({
    budgetProducts,
    setBudgetProducts,
    missing,
    setMissing,
    reset,
    open,
    setOpen,
    idsToDelete,
    setIdsToDelete,
    handleChange,
    formData,
    setFormData,
    handleSubmit,
    validate,
    disabled,
    setDisabled,
    errors
}) {

    const { state } = useContext(DataContext)

    useEffect(() => {
        if (budgetProducts.length > 0 && (open === 'NEW' || open === 'CONVERT')) {
            setBudgetProducts(budgetProducts.filter(bp => {
                const p = state.products.data.find(i => i.id === bp.product_id)
                if ((formData.type === 'CONTADO' && p?.cash) ||
                    (formData.type === 'CUENTA_CORRIENTE' && p?.cta_cte) ||
                    (formData.type === 'POXIPOL' && p?.poxipol)) return bp
            }))
        }
    }, [formData.type])

    return (
        <ModalComponent
            reduceWidth={500}
            open={open === 'NEW' || open === 'EDIT' || open === 'VIEW'}
            onClose={() => {
                setBudgetProducts([])
                setMissing(false)
                reset(setOpen)
                setIdsToDelete([])
            }}
        >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {open === 'NEW' && 'Nuevo presupuesto'}
                {open === 'EDIT' && 'Editar presupuesto'}
                {open === 'VIEW' && `Presupuesto #${formData.id}`}
            </Typography>
            <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, formData, validate, reset, setDisabled)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl>
                        <Autocomplete
                            disablePortal
                            id="client-autocomplete"
                            value={formData.client_id.toString().length > 0 ? `${state.clients.data.find(c => c.id === formData.client_id)?.first_name} - ${state.clients.data.find(c => c.id === formData.client_id)?.last_name} (${state.clients.data.find(c => c.id === formData.client_id)?.work_place})` : ''}
                            options={state.clients.data.map(c => ({ label: `${c.first_name} ${c.last_name} (${c.work_place})`, id: c.id }))}
                            noOptionsText="No hay clientes registrados."
                            onChange={(e, value) => handleChange({ target: { name: 'client_id', value: value?.id ?? '' } })}
                            renderInput={(params) => <TextField {...params} label="Cliente *" />}
                            isOptionEqualToValue={(option, value) => option.code === value.code || value.length === 0}
                            disabled={open === 'VIEW'}
                        />
                        {errors.client_id?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El cliente es requerido.
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
                                disabled={open === 'VIEW'}
                            />
                        </LocalizationProvider>
                        {errors.date?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La fecha es requerida.
                            </Typography>
                        }
                    </FormControl>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                        <FormControlLabel
                            control={<Checkbox disabled={open === 'VIEW'} />}
                            label="Cuenta Corriente"
                            checked={formData.type === 'CUENTA_CORRIENTE'}
                            disabled={budgetProducts.length > 0 && formData.type !== 'CUENTA_CORRIENTE' && formData.type !== 'CONTADO'}
                            onChange={e => {
                                if (e.target.checked) {
                                    setFormData({
                                        ...formData,
                                        type: 'CUENTA_CORRIENTE',
                                        discount: 0
                                    })
                                }
                            }}
                        />
                        <FormControlLabel
                            control={<Checkbox disabled={open === 'VIEW'} />}
                            label="Contado"
                            checked={formData.type === 'CONTADO'}
                            disabled={budgetProducts.length > 0 && formData.type !== 'CUENTA_CORRIENTE' && formData.type !== 'CONTADO'}
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
                            control={<Checkbox disabled={open === 'VIEW'} />}
                            label="Poxipol"
                            checked={formData.type === 'POXIPOL'}
                            disabled={budgetProducts.length > 0}
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
                    <AddProductsToBudget
                        products={state.products.data}
                        budgetProducts={budgetProducts}
                        setBudgetProducts={setBudgetProducts}
                        missing={missing}
                        setMissing={setMissing}
                        idsToDelete={idsToDelete}
                        setIdsToDelete={setIdsToDelete}
                        open={open}
                        formData={formData}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2, marginTop: 3 }}>
                    <FormControl>
                        <InputLabel htmlFor="discount">% Descuento</InputLabel>
                        <Input
                            id="discount"
                            type="number"
                            name="discount"
                            value={formData.discount}
                            disabled={open === 'VIEW'}
                        />
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="total">Total</InputLabel>
                        <Input
                            value={getBudgetTotal(formData, getBudgetSubtotal(budgetProducts.map(bp => {
                                return {
                                    ...bp,
                                    product: state.products.data.find(p => p.id === bp.product_id)
                                }
                            })))}
                            id="total"
                            type="number"
                            name="total"
                            disabled
                        />
                    </FormControl>
                </Box>
                <FormControl sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    justifyContent: 'center',
                    margin: '0 auto',
                    marginTop: 2,
                    width: '50%'
                }}>
                    <Button type="button" variant="outlined" onClick={() => {
                        setBudgetProducts([])
                        setMissing(false)
                        reset(setOpen)
                        setIdsToDelete([])
                    }} sx={{
                        width: '50%'
                    }}>
                        {open === 'VIEW' ? 'Cerrar' : 'Cancelar'}
                    </Button>
                    {(open === 'NEW' || open === 'EDIT') &&
                        <Button type="submit" variant="contained" disabled={disabled} sx={{
                            width: '50%'
                        }}>
                            Guardar
                        </Button>
                    }
                </FormControl>
            </form>
        </ModalComponent>
    )
}