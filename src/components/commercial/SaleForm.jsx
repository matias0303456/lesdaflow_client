/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react"
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, Tab, Tabs, TextField, Typography } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

import { AuthContext } from "../../providers/AuthProvider"
import { DataContext } from "../../providers/DataProvider"
import { usePayments } from "../../hooks/usePayments"
import { useForm } from "../../hooks/useForm"

import { AddProductsToSale } from "./AddProductsToSale"
import { ModalComponent } from "../common/ModalComponent"
import { PaymentsABM } from "./PaymentsABM"
import { PaymentForm } from "./PaymentForm"

import { getCurrentSubtotal, getCurrentTotal } from "../../utils/helpers"

export function SaleForm({
    saleProducts,
    setSaleProducts,
    missing,
    setMissing,
    reset,
    open,
    setOpen,
    idsToDelete,
    setIdsToDelete,
    formData,
    setFormData,
    handleSubmit,
    validate,
    disabled,
    setDisabled,
    handleChange,
    errors,
    isBlocked,
    setIsBlocked
}) {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const {
        open: openPayment,
        setOpen: setOpenPayment,
        handleSubmit: handleSubmitPayment,
        handleDelete: handleDeletePayment
    } = usePayments()
    const {
        formData: formDataPayment,
        setFormData: setFormDataPayment,
        validate: validatePayment,
        errors: errorsPayment,
        disabled: disabledPayment,
        handleChange: handleChangePayment,
        reset: resetPayment,
        setDisabled: setDisabledPayment
    } = useForm({
        defaultData: { id: '', sale_id: '', date: new Date(Date.now()), type: 'EFECTIVO', amount: '', observations: '' },
        rules: { amount: { required: true }, observations: { maxLength: 255 } }
    })

    const [valueTab, setValueTab] = useState(0)
    const [confirmed, setConfirmed] = useState(false)

    useEffect(() => {
        if (openPayment === 'EDIT') setValueTab(2)
        if (open === 'EDIT' && !openPayment && valueTab === 2) setValueTab(1)
        if (open === 'EDIT' && formDataPayment.id.toString().length === 0) {
            setFormDataPayment({ ...formDataPayment, sale_id: formData.id })
        }
    }, [open, openPayment])

    useEffect(() => {
        if (valueTab === 2 && open === 'EDIT' && openPayment === null) {
            setOpenPayment('NEW')
        } else {
            if (valueTab !== 2 || open === null) resetPayment(setOpenPayment)
        }
    }, [valueTab, open])

    const handleChangeTab = (_, newValue) => {
        setValueTab(newValue)
    }

    const handleClose = () => {
        setSaleProducts([])
        setMissing(false)
        reset(setOpen)
        setIdsToDelete([])
        setIsBlocked(false)
        setValueTab(0)
        setConfirmed(false)
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        }
    }

    return (
        <ModalComponent
            p={1}
            reduceWidth={100}
            open={open === 'NEW' || open === 'EDIT' || open === 'VIEW' || open === 'CONVERT'}
            onClose={handleClose}
        >
            <Box sx={{ marginBottom: open === 'EDIT' && valueTab === 1 ? 0 : 1 }}>
                <Tabs value={valueTab} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto">
                    <Tab
                        label={open === 'EDIT' ? `Editar venta #${formData.id}` :
                            (open === 'NEW' || open === 'CONVERT') ? 'Nueva venta' :
                                open === 'VIEW' ? `Venta #${formData.id}` : ''}
                        {...a11yProps(0)}
                    />
                    <Tab
                        disabled={open === 'NEW' || open === 'CONVERT'}
                        label="Pagos"
                        {...a11yProps(1)}
                    />
                    <Tab
                        disabled={open === 'NEW' || open === 'CONVERT' || open === 'VIEW' || openPayment === 'DELETE'}
                        label={openPayment === 'EDIT' ? `Editar pago #${formDataPayment.id}` : "Nuevo pago"}
                        {...a11yProps(2)}
                    />
                    <Tab
                        disabled={open === 'NEW' || open === 'CONVERT'}
                        label="Observaciones"
                        {...a11yProps(3)}
                    />
                </Tabs>
            </Box>
            {valueTab === 0 &&
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
                                                    type: 'CUENTA_CORRIENTE',
                                                    discount: 0
                                                })
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
                                        <InputLabel htmlFor="discount">% Descuento</InputLabel>
                                        <Input
                                            id="discount"
                                            type="number"
                                            name="discount"
                                            value={formData.discount}
                                            disabled={formData.type === 'CUENTA_CORRIENTE' || open === 'VIEW' || (open === 'EDIT' && auth?.user.role !== 'ADMINISTRADOR')}
                                        />
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
                                <Input value={getCurrentTotal(formData, saleProducts, state.products.data)} id="total" type="number" name="total" disabled />
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
                                    disabled={disabled || (isBlocked && open === 'NEW' || open === 'CONVERT')}
                                    sx={{ width: '50%' }}
                                >
                                    {confirmed ? 'Guardar' : 'Confirmar'}
                                </Button>
                            }
                        </FormControl>
                    </form>
                </Box>
            }
            {valueTab === 1 &&
                <Box sx={{ p: 0 }}>
                    <PaymentsABM
                        sale={formData}
                        rows={state.sales.data.find(s => s.id === formData.id)?.payments ?? []}
                        handleCloseSale={handleClose}
                        open={open}
                        openPayment={openPayment}
                        setOpenPayment={setOpenPayment}
                        formData={formDataPayment}
                        reset={resetPayment}
                        setFormData={setFormDataPayment}
                        handleDelete={handleDeletePayment}
                    />
                </Box>
            }
            {valueTab === 2 &&
                <Box sx={{ p: 1 }}>
                    <PaymentForm
                        sale={formData}
                        handleSubmit={handleSubmitPayment}
                        handleChange={handleChangePayment}
                        handleCloseSale={handleClose}
                        validate={validatePayment}
                        formData={formDataPayment}
                        reset={resetPayment}
                        setOpen={setOpenPayment}
                        disabled={disabledPayment}
                        setDisabled={setDisabledPayment}
                        errors={errorsPayment}
                    />
                </Box>
            }
            {valueTab === 3 &&
                <Box sx={{ p: 1 }}>
                    <textarea
                        style={{
                            width: '100%',
                            height: 300,
                            border: '1px solid #C4C4C4',
                            padding: 10,
                            borderRadius: 5,
                            resize: 'none'
                        }}
                        disabled={open === 'VIEW'}
                        id="observations"
                        name="observations"
                        placeholder="Observaciones..."
                        value={formData.observations}
                        onChange={handleChange}
                    ></textarea>
                    {errors.observations?.type === 'maxLength' &&
                        <Typography variant="caption" color="red" marginTop={1}>
                            * Las observaciones son demasiado largas.
                        </Typography>
                    }
                    <Box sx={{
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
                        {(open === 'NEW' || open === 'CONVERT' || open === 'EDIT') &&
                            <Button
                                type="button"
                                variant="contained"
                                disabled={disabled}
                                sx={{ width: '50%' }}
                                onClick={e => handleSubmit(e, formData, validate, reset, setDisabled)}
                            >
                                Guardar
                            </Button>
                        }
                    </Box>
                </Box>
            }
        </ModalComponent >
    )
}