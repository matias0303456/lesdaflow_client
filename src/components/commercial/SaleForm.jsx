/* eslint-disable react/prop-types */
import { useContext, useEffect, useMemo, useState } from "react"
import { Box, Tab, Tabs } from "@mui/material"

import { DataContext } from "../../providers/DataProvider"
import { usePayments } from "../../hooks/usePayments"
import { useRegisters } from "../../hooks/useRegisters"

import { ModalComponent } from "../common/ModalComponent"
import { PaymentsABM } from "./PaymentsABM"
import { PaymentForm } from "./PaymentForm"
import { SaleFormFields } from "./SaleFormFields"
import { SaleObservations } from "./SaleObservations"
import { VouchersABM } from "./VouchersABM"

import { a11yProps, getCurrentTotal, getDiscountsAndSurchargesValues } from "../../utils/helpers"
import { VoucherForm } from "./VoucherForm"

export function SaleForm({
    saleArticles,
    setSaleArticles,
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
        if (saleArticles.length > 0 && (open === 'NEW' || open === 'CONVERT')) {
            setSaleArticles(saleArticles.filter(sp => {
                const p = state.articles.data.find(i => i.id === sp.article_id)
                if ((formData.type === 'CONTADO' && p?.cash) ||
                    (formData.type === 'CUENTA_CORRIENTE' && p?.cta_cte)) return sp
            }))
        }
    }, [formData.type])

    const discAndSurch = useMemo(() => {
        return getDiscountsAndSurchargesValues(saleArticles, state.articles.data)
    }, [saleArticles])

    useEffect(() => {
        if (open === 'EDIT') return
        setFormData({
            ...formData,
            total: getCurrentTotal(saleArticles, state.articles.data, discAndSurch),
        })
    }, [saleArticles, open])


    const handleChangeTab = (_, newValue) => {
        setValueTab(newValue)
    }

    const handleClose = () => {
        reset(setOpen)
        setSaleArticles([])
        setMissing(false)
        setIdsToDelete([])
        setValueTab(0)
        setConfirmed(false)
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
                        disabled={open !== 'EDIT'}
                        label={openPayment === 'EDIT' ? `Editar pago #${formDataPayment.id}` : "Nuevo pago"}
                        {...a11yProps(2)}
                    />
                    <Tab
                        disabled={open === 'NEW' || open === 'CONVERT'}
                        label="Observaciones"
                        {...a11yProps(3)}
                    />
                    <Tab
                        disabled={open === 'NEW' || open === 'CONVERT'}
                        label="Comprobantes"
                        {...a11yProps(4)}
                    />
                    <Tab
                        disabled={open !== 'EDIT'}
                        label="Nuevo comprobante"
                        {...a11yProps(5)}
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
                    saleArticles={saleArticles}
                    setSaleArticles={setSaleArticles}
                    missing={missing}
                    setMissing={setMissing}
                    idsToDelete={idsToDelete}
                    setIdsToDelete={setIdsToDelete}
                    handleClose={handleClose}
                    disabled={disabled}
                    open={open}
                    discAndSurch={discAndSurch}
                />
            }
            {valueTab === 1 &&
                <Box sx={{ p: 0 }}>
                    <PaymentsABM
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
                <SaleObservations
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    handleClose={handleClose}
                    disabled={disabled}
                    handleSubmit={handleSubmit}
                    validate={validate}
                    reset={reset}
                    setDisabled={setDisabled}
                    open={open}
                />
            }
            {valueTab === 4 &&
                <Box sx={{ p: 0 }}>
                    <VouchersABM
                        rows={state.sales.data.find(s => s.id === formData.id)?.payments ?? []}
                        handleCloseSale={handleClose}
                    />
                </Box>
            }
            {valueTab === 5 &&
                <Box sx={{ p: 1 }}>
                    <VoucherForm
                        sale={formData}
                        handleCloseSale={handleClose}
                        resetSale={reset}
                        setOpenSale={setOpen}
                    />
                </Box>
            }
        </ModalComponent >
    )
}