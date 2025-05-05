/* eslint-disable react/prop-types */
import { useContext, useEffect, useMemo } from "react"
import { Autocomplete, Box, FormControl, InputLabel, TextField, Typography, Input, Button, Select, MenuItem } from "@mui/material"

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
    errors,
    isFinalConsumer,
    setIsFinalConsumer
}) {

    const { state } = useContext(DataContext)

    useEffect(() => {
        if (budgetArticles.length > 0 && (open === 'NEW' || open === 'CONVERT')) {
            setBudgetArticles(budgetArticles.filter(bp => {
                const p = state.articles.find(i => i.id === bp.article_id)
                if ((formData.type === 'CONTADO' && p?.cash) ||
                    (formData.type === 'CUENTA_CORRIENTE' && p?.cta_cte)) return bp
            }))
        }
    }, [formData.type])

    const discAndSurch = useMemo(() => {
        return getDiscountsAndSurchargesValues(budgetArticles, state.articles)
    }, [budgetArticles])

    useEffect(() => {
        if (open === 'EDIT') return
        setFormData({
            ...formData,
            total: getCurrentTotal(budgetArticles, state.articles, discAndSurch),
        })
    }, [budgetArticles, open])

    const getCurrentClient = () => {
        if (isFinalConsumer) {
            return 'CONSUMIDOR FINAL'
        } else {
            const { client_id } = formData
            if (!client_id && open !== 'NEW') return 'CONSUMIDOR FINAL'
            const c = state.clients.find(c => c.id === client_id)
            if (client_id.toString().length === 0) return ''
            return `${c?.first_name} ${c?.last_name}`
        }
    }

    const handleChangeClient = (_, data) => {
        let name = 'client_id'
        let value = data?.id ?? ''
        if (data === 'CONSUMIDOR FINAL') {
            name = 'final_consumer_document'
            setIsFinalConsumer(true)
        } else {
            setIsFinalConsumer(false)
        }
        handleChange({ target: { name, value } })
    }

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
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: { xs: '100%', md: '60%' },
                            gap: 2
                        }}>
                            <FormControl>
                                <Autocomplete
                                    disablePortal
                                    id="client-autocomplete"
                                    value={getCurrentClient()}
                                    options={[
                                        'CONSUMIDOR FINAL',
                                        ...state.clients.map(c => ({ label: `${c.first_name} ${c.last_name}`, id: c.id }))
                                    ]}
                                    noOptionsText="No hay clientes registrados."
                                    onChange={handleChangeClient}
                                    renderInput={(params) => <TextField {...params} label="Cliente *" />}
                                    isOptionEqualToValue={(option, value) => option.id === value.id || value.length === 0}
                                    disabled={open === 'VIEW'}
                                />
                                {errors.client_id?.type === 'required' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El cliente es requerido.
                                    </Typography>
                                }
                            </FormControl>
                            {isFinalConsumer &&
                                <FormControl>
                                    <InputLabel htmlFor="final_consumer_document">DNI / CUIL</InputLabel>
                                    <Input id="final_consumer_document" type="text" name="final_consumer_document" value={formData.final_consumer_document} />
                                    {errors.final_consumer_document?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El documento es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                            }
                        </Box>
                        <FormControl sx={{ width: { xs: '100%', md: '40%' } }}>
                            <InputLabel id="type-select">Tipo</InputLabel>
                            <Select
                                labelId="type-select"
                                id="type"
                                value={formData.type}
                                label="Tipo Comp."
                                name="type"
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <MenuItem value="">Seleccione</MenuItem>
                                <MenuItem value="EFECTIVO">EFECTIVO</MenuItem>
                                <MenuItem value="CONTADO">CONTADO</MenuItem>
                                <MenuItem value="DEBITO">DEBITO</MenuItem>
                                <MenuItem value="CREDITO">CREDITO</MenuItem>
                                <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <AddArticlesToBudget
                        articles={state.articles}
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
                        setIsFinalConsumer(false)
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