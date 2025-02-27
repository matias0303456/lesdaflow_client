/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react"
import { Box, Button, Tab, Tabs, Typography } from "@mui/material"

import { DataContext } from "../../providers/DataProvider"
import { usePayments } from "../../hooks/usePayments"
import { useRegisters } from "../../hooks/useRegisters"

import { ModalComponent } from "../common/ModalComponent"
import { PaymentsABM } from "./PaymentsABM"
import { PaymentForm } from "./PaymentForm"
import { SaleFormFields } from "./SaleFormFields"

import { a11yProps, getCurrentTotal } from "../../utils/helpers"

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

    const { state } = useContext(DataContext)

    const { getRegisters } = useRegisters()
    const {
        open: openPayment,
        setOpen: setOpenPayment,
        handleSubmit: handleSubmitPayment,
        handleDelete: handleDeletePayment,
        paymentFormData
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
    } = paymentFormData

    const [valueTab, setValueTab] = useState(0)
    const [confirmed, setConfirmed] = useState(false)
    const [discountApplied, setDiscountApplied] = useState('')

    useEffect(() => {
        getRegisters()
    }, [])

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

    useEffect(() => {
        if (saleProducts.length > 0 && (open === 'NEW' || open === 'CONVERT')) {
            setSaleProducts(saleProducts.filter(sp => {
                const p = state.products.data.find(i => i.id === sp.product_id)
                if ((formData.type === 'CONTADO' && p?.cash) ||
                    (formData.type === 'CUENTA_CORRIENTE' && p?.cta_cte) ||
                    (formData.type === 'POXIPOL' && p?.poxipol)) return sp
            }))
        }
    }, [formData.type])

    useEffect(() => {
        if (open === 'EDIT') return
        setFormData({
            ...formData,
            total: getCurrentTotal(discountApplied, saleProducts, state.products.data),
        })
    }, [discountApplied, saleProducts, state.products.data, open])

    const handleChangeTab = (_, newValue) => {
        setValueTab(newValue)
    }

    const handleClose = () => {
        reset(setOpen)
        setSaleProducts([])
        setMissing(false)
        setIdsToDelete([])
        setIsBlocked(false)
        setValueTab(0)
        setConfirmed(false)
        setDiscountApplied('')
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
                <SaleFormFields
                    handleChange={handleChange}
                    confirmed={confirmed}
                    handleSubmit={handleSubmit}
                    formData={formData}
                    setFormData={setFormData}
                    validate={validate}
                    reset={reset}
                    setDisabled={setDisabled}
                    setConfirmed={setConfirmed}
                    errors={errors}
                    isBlocked={isBlocked}
                    saleProducts={saleProducts}
                    setSaleProducts={setSaleProducts}
                    discountApplied={discountApplied}
                    setDiscountApplied={setDiscountApplied}
                    missing={missing}
                    setMissing={setMissing}
                    idsToDelete={idsToDelete}
                    setIdsToDelete={setIdsToDelete}
                    handleClose={handleClose}
                    disabled={disabled}
                    open={open}
                />
            }
            {
                valueTab === 1 &&
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
            {
                valueTab === 2 &&
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
            {
                valueTab === 3 &&
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