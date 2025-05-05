/* eslint-disable react/prop-types */
import { useContext, useEffect, useMemo, useState } from "react"
import { Box, Tab, Tabs } from "@mui/material"

import { DataContext } from "../../providers/DataProvider"
import { useRegisters } from "../../hooks/useRegisters"

import { ModalComponent } from "../common/ModalComponent"
import { SaleFormFields } from "./SaleFormFields"
import { SaleObservations } from "./SaleObservations"
import { VouchersABM } from "./VouchersABM"
import { VoucherForm } from "./VoucherForm"

import { a11yProps, getCurrentTotal, getDiscountsAndSurchargesValues } from "../../utils/helpers"

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
    isFinalConsumer,
    setIsFinalConsumer
}) {

    const { state } = useContext(DataContext)

    const { getRegisters } = useRegisters()

    const [valueTab, setValueTab] = useState(0)
    const [confirmed, setConfirmed] = useState(false)

    useEffect(() => {
        getRegisters()
    }, [])

    useEffect(() => {
        if (saleArticles.length > 0 && (open === 'NEW' || open === 'CONVERT')) {
            setSaleArticles(saleArticles.filter(sp => {
                const p = state.articles.find(i => i.id === sp.article_id)
                if ((formData.type === 'CONTADO' && p?.cash) ||
                    (formData.type === 'CUENTA_CORRIENTE' && p?.cta_cte)) return sp
            }))
        }
    }, [formData.type])

    const discAndSurch = useMemo(() => {
        return getDiscountsAndSurchargesValues(saleArticles, state.articles)
    }, [saleArticles])

    useEffect(() => {
        if (open === 'EDIT') return
        setFormData({
            ...formData,
            total: getCurrentTotal(saleArticles, state.articles, discAndSurch),
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
        setIsFinalConsumer(false)
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
                        label={open === 'EDIT' ? `Editar boleta #${formData.id}` :
                            (open === 'NEW' || open === 'CONVERT') ? 'Nueva boleta' :
                                open === 'VIEW' ? `Boleta #${formData.id}` : ''}
                        {...a11yProps(0)}
                    />
                    <Tab
                        disabled={open === 'NEW' || open === 'CONVERT'}
                        label="Observaciones"
                        {...a11yProps(1)}
                    />
                    <Tab
                        disabled={open === 'NEW' || open === 'CONVERT'}
                        label="Comprobantes"
                        {...a11yProps(2)}
                    />
                    <Tab
                        disabled={open !== 'EDIT'}
                        label="Nuevo comprobante"
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
                    isFinalConsumer={isFinalConsumer}
                    setIsFinalConsumer={setIsFinalConsumer}
                />
            }
            {valueTab === 1 &&
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
            {valueTab === 2 &&
                <Box sx={{ p: 0 }}>
                    <VouchersABM
                        rows={state.sales.find(s => s.id === formData.id)?.vouchers ?? []}
                        handleCloseSale={handleClose}
                    />
                </Box>
            }
            {valueTab === 3 &&
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