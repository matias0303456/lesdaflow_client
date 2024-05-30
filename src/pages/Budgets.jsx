import { useContext, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { format } from "date-fns";

import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useBudgets } from "../hooks/useBudgets";
import { useProducts } from "../hooks/useProducts";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/common/Layout";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { ModalComponent } from "../components/common/ModalComponent";
import { BudgetFilter } from "../components/filters/BudgetFilter";
import { BudgetForm } from "../components/commercial/BudgetForm";

import { getBudgetTotal } from "../utils/helpers";
import { SaleForm } from "../components/commercial/SaleForm";
import { useSales } from "../hooks/useSales";

export function Budgets() {

    const { state } = useContext(DataContext)

    const { getProducts } = useProducts()
    const { getClients } = useClients()
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
        missing
    } = useBudgets()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: { id: '', client_id: '', date: new Date(Date.now()) },
        rules: { client_id: { required: true }, date: { required: true } }
    })
    const {
        saleProducts,
        setSaleProducts,
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
            discount: '',
            installments: '',
            type: 'CUENTA_CORRIENTE',
            date: new Date(Date.now())
        },
        rules: {
            client_id: {
                required: true
            },
            date: {
                required: true
            },
            installments: {
                required: true
            }
        }
    })

    useEffect(() => {
        getClients()
        getProducts()
    }, [])

    useEffect(() => {
        if (open === 'EDIT' || open === 'VIEW') {
            setBudgetProducts(formData.budget_products)
        }
        if (openNewSale === 'CONVERT') {
            setNewSale({
                id: formData.id,
                client_id: formData.client_id,
                discount: '',
                installments: '',
                type: 'CUENTA_CORRIENTE',
                date: new Date(Date.now())
            })
            setSaleProducts(formData.budget_products)
        }
    }, [formData])

    useEffect(() => {
        console.log(idsToDelete)
    }, [idsToDelete])

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Cod. Pres.',
            accessor: 'id'
        },
        {
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha',
            accessor: (row) => format(new Date(row.date), 'dd/MM/yy')
        },
        {
            id: 'hour',
            numeric: false,
            disablePadding: true,
            label: 'Hora',
            accessor: (row) => format(new Date(row.date), 'hh:ss')
        },
        {
            id: 'seller',
            numeric: false,
            disablePadding: true,
            label: 'Vendedor',
            accessor: (row) => `${row.client.user.first_name} ${row.client.user.last_name}`
        },
        {
            id: 'client',
            numeric: false,
            disablePadding: true,
            label: 'Cliente',
            accessor: (row) => `${row.client.first_name} ${row.client.last_name}`
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            accessor: (row) => row.client.address
        },
        {
            id: 'total_amount',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            accessor: (row) => `$${getBudgetTotal(row.budget_products)}`
        },
    ]

    return (
        <Layout title="Presupuestos">
            <DataGridWithBackendPagination
                headCells={headCells}
                loading={loadingBudgets || disabled}
                rows={state.budgets.data}
                entityKey="budgets"
                getter={getBudgets}
                setOpen={setOpen}
                setOpenNewSale={setOpenNewSale}
                setFormData={setFormData}
                showPDFAction
                showViewAction
                showEditAction
                showDeleteAction
                showConvertToSale="Convertir a venta"
                contentHeader={
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="outlined" onClick={() => setOpen('NEW')}>
                                Agregar
                            </Button>
                            <Button variant="outlined" color='success'>
                                Excel
                            </Button>
                            <Button variant="outlined" color='error'>
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
        </Layout>
    )
}