import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, LinearProgress, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useBudgets } from "../hooks/useBudgets";
import { useProducts } from "../hooks/useProducts";
import { useClients } from "../hooks/useClients";
import { useSales } from "../hooks/useSales";
import { useDiscounts } from "../hooks/useDiscounts";

import { Layout } from "../components/common/Layout";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { ModalComponent } from "../components/common/ModalComponent";
import { BudgetFilter } from "../components/filters/BudgetFilter";
import { BudgetForm } from "../components/commercial/BudgetForm";
import { SaleForm } from "../components/commercial/SaleForm";

import { REPORT_URL } from "../utils/urls";
import { FiltersContext } from "../providers/FiltersProvider";

export function Budgets() {

    const { auth } = useContext(AuthContext)
    const { state: dataState } = useContext(DataContext)
    const { state: filtersState } = useContext(FiltersContext)

    const navigate = useNavigate()

    const { getProducts } = useProducts()
    const { getClients } = useClients()
    const { getDiscounts } = useDiscounts()
    const {
        setBudgetProducts,
        loadingBudgets,
        open,
        setOpen,
        getBudgets,
        handleDelete,
        handleSubmit,
        setMissing,
        setIdsToDelete,
        budgetProducts,
        idsToDelete,
        missing,
        budgetFormData,
        headCells
    } = useBudgets()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = budgetFormData
    const {
        saleProducts,
        setSaleProducts,
        missing: missingNewSale,
        setMissing: setMissingNewSale,
        open: openNewSale,
        setOpen: setOpenNewSale,
        idsToDelete: idsToDeleteNewSale,
        setIdsToDelete: setIdsToDeleteNewSale,
        handleSubmit: handleSubmitNewSale,
        discountApplied,
        setDiscountApplied,
        saleFormData
    } = useSales()
    const {
        formData: newSale,
        setFormData: setNewSale,
        handleChange: handleChangeNewSale,
        disabled: disabledNewSale,
        setDisabled: setDisabledNewSale,
        validate: validateNewSale,
        reset: resetNewSale,
        errors: errorsNewSale
    } = saleFormData

    useEffect(() => {
        if (auth?.user.role !== 'ADMINISTRADOR' && auth?.user.role !== 'VENDEDOR') navigate('/prep-ventas')
    }, [])

    useEffect(() => {
        getClients()
        getProducts()
        getDiscounts(`?is_available=true`)
    }, [])

    useEffect(() => {
        if (open === 'EDIT' || open === 'VIEW') {
            setBudgetProducts(formData.budget_products)
        }
        if (openNewSale === 'CONVERT') {
            setNewSale({
                id: formData.id,
                client_id: formData.client_id,
                type: formData.type,
                date: new Date(Date.now())
            })
            setSaleProducts(formData.budget_products)
        }
    }, [formData])

    useEffect(() => {
        const { page, offset, filters } = filtersState['budgets']
        getBudgets(`?page=${page}&offset=${offset}${filters}`)
    }, [filtersState['budgets']])

    return (
        <Layout title="Presupuestos">
            {(loadingBudgets || disabled) ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGridWithBackendPagination
                    headCells={headCells}
                    rows={dataState.budgets.data}
                    entityKey="budgets"
                    setOpen={setOpen}
                    setOpenNewSale={setOpenNewSale}
                    setFormData={setFormData}
                    showPDFAction={`${REPORT_URL}/presupuesto-pdf?token=${auth?.token}&id=`}
                    showConvertToSale="Convertir a venta"
                    showViewAction
                    showEditAction
                    showDeleteAction
                    contentHeader={
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: '20%' } }}>
                                <Button variant="outlined" onClick={() => {
                                    reset()
                                    setOpen('NEW')
                                }}>
                                    Agregar
                                </Button>
                                <Button variant="outlined" color='success' onClick={() => {
                                    window.open(`${REPORT_URL}/budgets-excel?token=${auth?.token}`, '_blank')
                                }}>
                                    Excel
                                </Button>
                                <Button variant="outlined" color='error' onClick={() => {
                                    window.open(`${REPORT_URL}/presupuesto-pdf?token=${auth?.token}`, '_blank')
                                }}>
                                    PDF
                                </Button>
                            </Box>
                            <BudgetFilter />
                        </Box>
                    }
                >
                    <BudgetForm
                        budgetProducts={budgetProducts}
                        setBudgetProducts={setBudgetProducts}
                        missing={missing}
                        setMissing={setMissing}
                        reset={reset}
                        open={open}
                        setOpen={setOpen}
                        idsToDelete={idsToDelete}
                        setIdsToDelete={setIdsToDelete}
                        handleChange={handleChange}
                        formData={formData}
                        setFormData={setFormData}
                        handleSubmit={handleSubmit}
                        validate={validate}
                        disabled={disabled}
                        setDisabled={setDisabled}
                        errors={errors}
                    />
                    <SaleForm
                        saleProducts={saleProducts}
                        setSaleProducts={setSaleProducts}
                        missing={missingNewSale}
                        setMissing={setMissingNewSale}
                        reset={resetNewSale}
                        open={openNewSale}
                        setOpen={setOpenNewSale}
                        idsToDelete={idsToDeleteNewSale}
                        setIdsToDelete={setIdsToDeleteNewSale}
                        formData={newSale}
                        setFormData={setNewSale}
                        handleSubmit={handleSubmitNewSale}
                        validate={validateNewSale}
                        disabled={disabledNewSale}
                        setDisabled={setDisabledNewSale}
                        handleChange={handleChangeNewSale}
                        errors={errorsNewSale}
                        discountApplied={discountApplied}
                        setDiscountApplied={setDiscountApplied}
                    />
                    <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)} reduceWidth={900}>
                        <Typography variant="h6" marginBottom={1} textAlign="center">
                            Confirmar eliminación de presupuesto
                        </Typography>
                        <Typography variant="body1" marginBottom={2} textAlign="center">
                            Los datos no podrán recuperarse
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{ width: '35%' }}>
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                variant="contained"
                                disabled={disabled}
                                sx={{ width: '35%' }}
                                onClick={() => handleDelete(formData)}
                            >
                                Confirmar
                            </Button>
                        </Box>
                    </ModalComponent>
                </DataGridWithBackendPagination>
            }
        </Layout>
    )
}