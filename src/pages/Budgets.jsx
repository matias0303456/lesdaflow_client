import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, LinearProgress, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useBudgets } from "../hooks/useBudgets";
import { useArticles } from "../hooks/useArticles";
import { useClients } from "../hooks/useClients";
import { useSales } from "../hooks/useSales";

import { Layout } from "../components/common/Layout";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { ModalComponent } from "../components/common/ModalComponent";
import { BudgetFilter } from "../components/filters/BudgetFilter";
import { BudgetForm } from "../components/commercial/BudgetForm";
import { SaleForm } from "../components/commercial/SaleForm";

import { REPORT_URL } from "../utils/urls";

export function Budgets() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const navigate = useNavigate()

    const { getArticles } = useArticles()
    const { getClients } = useClients()
    const {
        setBudgetArticles,
        loadingBudgets,
        open,
        setOpen,
        getBudgets,
        handleDelete,
        handleSubmit,
        setMissing,
        setIdsToDelete,
        budgetArticles,
        idsToDelete,
        missing,
        headCells,
        filter,
        setFilter,
        count
    } = useBudgets()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: { id: '', client_id: '', date: new Date(Date.now()), type: 'CUENTA_CORRIENTE', total: '0.00' },
        rules: { client_id: { required: true }, date: { required: true } }
    })
    const {
        saleArticles,
        setSaleArticles,
        missing: missingNewSale,
        setMissing: setMissingNewSale,
        open: openNewSale,
        setOpen: setOpenNewSale,
        idsToDelete: idsToDeleteNewSale,
        setIdsToDelete: setIdsToDeleteNewSale,
        handleSubmit: handleSubmitNewSale
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
    } = useForm({
        defaultData: {
            id: '',
            client_id: '',
            type: 'CUENTA_CORRIENTE',
            date: new Date(Date.now()),
            total: '0.00'
        },
        rules: {
            client_id: {
                required: true
            },
            date: {
                required: true
            }
        }
    })

    useEffect(() => {
        if (auth?.user.role !== 'ADMINISTRADOR' && auth?.user.role !== 'VENDEDOR') navigate('/prep-ventas')
    }, [])

    useEffect(() => {
        getClients()
        getArticles()
    }, [])

    useEffect(() => {
        if (open === 'EDIT' || open === 'VIEW') {
            setBudgetArticles(formData.budget_articles)
        }
        if (openNewSale === 'CONVERT') {
            setNewSale({
                id: formData.id,
                client_id: formData.client_id,
                type: formData.type,
                date: new Date(Date.now())
            })
            setSaleArticles(formData.budget_articles)
        }
    }, [formData])

    useEffect(() => {
        const { page, offset, from, to, client, type } = filter
        const fromIsNotString = typeof from !== 'string'
        const toIsNotString = typeof to !== 'string'
        getBudgets(`?page=${page}&offset=${offset}&from=${fromIsNotString ? new Date(from).toISOString() : ''}&to=${toIsNotString ? new Date(to).toISOString() : ''}&client=${client}&type=${type}`)
    }, [filter])

    return (
        <Layout title="Presupuestos">
            {(loadingBudgets || disabled) ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGridWithBackendPagination
                    headCells={headCells}
                    rows={state.budgets}
                    setOpen={setOpen}
                    setFormData={setFormData}
                    showPDFAction={`${REPORT_URL}/presupuesto-pdf?token=${auth?.token}&id=`}
                    // showConvertToSale="Convertir a venta"
                    filter={filter}
                    setFilter={setFilter}
                    count={count}
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
                                {/* <Button variant="outlined" color='success' onClick={() => {
                                window.open(`${REPORT_URL}/budgets-excel?token=${auth?.token}`, '_blank')
                            }}>
                                Excel
                            </Button>
                            <Button variant="outlined" color='error' onClick={() => {
                                window.open(`${REPORT_URL}/presupuesto-pdf?token=${auth?.token}`, '_blank')
                            }}>
                                PDF
                            </Button> */}
                            </Box>
                            <BudgetFilter filter={filter} setFilter={setFilter} />
                        </Box>
                    }
                >
                    <BudgetForm
                        budgetArticles={budgetArticles}
                        setBudgetArticles={setBudgetArticles}
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
                        saleArticles={saleArticles}
                        setSaleArticles={setSaleArticles}
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