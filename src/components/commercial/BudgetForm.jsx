/* eslint-disable react/prop-types */
import { useContext, useEffect, useMemo } from "react"
import { Autocomplete, Box, FormControl, InputLabel, TextField, Typography, Input, Button, FormControlLabel, Checkbox } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

import { DataContext } from "../../providers/DataProvider"

import { AddArticlesToBudget } from "./AddArticlesToBudget"
import { ModalComponent } from "../common/ModalComponent"
import { DataDisplay } from "./DataDisplay"

import { getCurrentTotal, getDiscountsAndSurchargesValues } from "../../utils/helpers"

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

    useEffect(() => {
        if (budgetArticles.length > 0 && (open === 'NEW' || open === 'CONVERT')) {
            setBudgetArticles(budgetArticles.filter(bp => {
                const p = state.articles.data.find(i => i.id === bp.article_id)
                if ((formData.type === 'CONTADO' && p?.cash) ||
                    (formData.type === 'CUENTA_CORRIENTE' && p?.cta_cte)) return bp
            }))
        }
    }, [formData.type])

    const discAndSurch = useMemo(() => {
        return getDiscountsAndSurchargesValues(budgetArticles, state.articles.data)
    }, [budgetArticles])

    useEffect(() => {
        if (open === 'EDIT') return
        setFormData({
            ...formData,
            total: getCurrentTotal(budgetArticles, state.articles.data, discAndSurch),
        })
    }, [budgetArticles, open])

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
                            value={formData.client_id.toString().length > 0 ? `${state.clients.data.find(c => c.id === formData.client_id)?.first_name} - ${state.clients.data.find(c => c.id === formData.client_id)?.last_name}` : ''}
                            options={state.clients.data.map(c => ({ label: `${c.first_name} ${c.last_name}`, id: c.id }))}
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
                    </Box>
                    <AddArticlesToBudget
                        articles={state.articles.data}
                        budgetArticles={budgetArticles}
                        setBudgetArticles={setBudgetArticles}
                        missing={missing}
                        setMissing={setMissing}
                        idsToDelete={idsToDelete}
                        setIdsToDelete={setIdsToDelete}
                        open={open}
                    />
                </Box>
                <DataDisplay data={discAndSurch} />
                <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2, marginTop: 3 }}>
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