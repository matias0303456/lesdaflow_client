import { useContext, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { format } from "date-fns";

import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useBudgets } from "../hooks/useBudgets";

import { Layout } from "../components/Layout";
import { DataGridWithBackendPagination } from "../components/DataGridWithBackendPagination";

import { getSaleTotal } from "../utils/helpers";

export function Budgets() {

    const { state } = useContext(DataContext)

    const { setBudgetProducts, loadingBudgets, open, setOpen, getBudgets } = useBudgets()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            client_id: ''
        },
        rules: {
            client_id: {
                required: true
            }
        }
    })

    useEffect(() => {
        if (open === 'EDIT' || open === 'VIEW') {
            setBudgetProducts(formData.budget_products)
        }
    }, [formData])

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
            label: 'Clientes',
            accessor: (row) => `${row.client.first_name} ${row.client.last_name}`
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            accessor: (row) => row.client.user.address
        },
        {
            id: 'total_amount',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            accessor: (row) => getSaleTotal(row)
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
                showPDFAction
                showViewAction
                showEditAction
                showDeleteAction
                contentHeader={
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 2
                    }}>
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
                        {/* <SaleFilter sales={sales} setSales={setSales} /> */}
                    </Box>
                }
            />
        </Layout>
    )
}