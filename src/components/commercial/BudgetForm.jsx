/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react"
import { Autocomplete, Box, FormControl, InputLabel, TextField, Typography, Input, Button, FormControlLabel, Checkbox, Select, MenuItem } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

import { DataContext } from "../../providers/DataProvider"

import { AddArticlesToBudget } from "./AddArticlesToBudget"
import { ModalComponent } from "../common/ModalComponent"

import { getAvailableDiscounts, getCurrentTotal } from "../../utils/helpers"

export function BudgetForm({
    budgetArticles,
    setBudgetArticles,
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

    const [discountApplied, setDiscountApplied] = useState('')

    useEffect(() => {
        if (budgetArticles.length > 0 && (open === 'NEW' || open === 'CONVERT')) {
            setBudgetArticles(budgetArticles.filter(bp => {
                const p = state.articles.data.find(i => i.id === bp.article_id)
                if ((formData.type === 'CONTADO' && p?.cash) ||
                    (formData.type === 'CUENTA_CORRIENTE' && p?.cta_cte) ||
                    (formData.type === 'POXIPOL' && p?.poxipol)) return bp
            }))
        }
    }, [formData.type])

    useEffect(() => {
        if (open === 'EDIT') return
        setFormData({
            ...formData,
            total: getCurrentTotal(discountApplied, budgetArticles, state.articles.data),
        })
    }, [discountApplied, budgetArticles, state.articles.data, open])

    return (
        <ModalComponent
            reduceWidth={500}
            open={open === 'NEW' || open === 'EDIT' || open === 'VIEW'}
            onClose={() => {
                setBudgetArticles([])
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
                            disabled={budgetArticles.length > 0 && formData.type !== 'CUENTA_CORRIENTE' && formData.type !== 'CONTADO'}
                            onChange={e => {
                                if (e.target.checked) {
                                    setFormData({
                                        ...formData,
                                        type: 'CUENTA_CORRIENTE'
                                    })
                                }
                            }}
                        />
                        <FormControlLabel
                            control={<Checkbox disabled={open === 'VIEW'} />}
                            label="Contado"
                            checked={formData.type === 'CONTADO'}
                            disabled={budgetArticles.length > 0 && formData.type !== 'CUENTA_CORRIENTE' && formData.type !== 'CONTADO'}
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
                            disabled={budgetArticles.length > 0}
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
                    <AddArticlesToBudget
                        ARTICLES={state.articles.data}
                        budgetArticles={budgetArticles}
                        setBudgetArticles={setBudgetArticles}
                        missing={missing}
                        setMissing={setMissing}
                        idsToDelete={idsToDelete}
                        setIdsToDelete={setIdsToDelete}
                        open={open}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2, marginTop: 3 }}>
                    <FormControl sx={{ width: '30%' }}>
                        <InputLabel>Descuento</InputLabel>
                        <Select
                            labelId="discount-select"
                            id="discount"
                            value={discountApplied.id ?? ''}
                            disabled={formData.type === 'POXIPOL' || open === 'VIEW' || open === 'EDIT'}
                            label="Descuento"
                            name="discount"
                            onChange={(e) => setDiscountApplied(state.discounts.data.find(d => d.id === e.target.value))}
                            sx={{ width: "100%" }}
                        >
                            <MenuItem value="">Ninguno</MenuItem>
                            {getAvailableDiscounts(formData, budgetArticles, state.articles.data, state.discounts.data)
                                .map(d => (
                                    <MenuItem key={d.id} value={d.id}>
                                        {d.name}
                                    </MenuItem>
                                ))}
                        </Select>
                        {discountApplied?.base > 0 && discountApplied?.base > formData.total &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El monto neto debe ser mayor o igual a la base del descuento: ${discountApplied.base}.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="total">Total</InputLabel>
                        <Input
                            value={formData.total}
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
                        setBudgetArticles([])
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