import { useContext, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";

import { useProducts } from '../hooks/useProducts'
import { useForm } from "../hooks/useForm";
import { useSuppliers } from "../hooks/useSuppliers";

import { DataContext } from "../providers/DataProvider";
import { Layout } from "../components/Layout";
import { OrderFilter } from "../components/filters/OrderFilter";
import { DataGridWithBackendPagination } from "../components/DataGridWithBackendPagination";

export function Orders() {

    const { state } = useContext(DataContext)

    const { loadingProducts, getProducts } = useProducts()
    const { loadingSuppliers, getSuppliers } = useSuppliers()
    const [open, setOpen] = useState(null)
    const { setFormData, disabled } = useForm({
        defaultData: {
            id: '',
            code: '',
            details: '',
            buy_price: '',
            min_stock: '',
            earn: '',
            size: '',
            supplier_id: '',
            amount: '',
            observations: ''
        },
        rules: {
            code: {
                required: true,
                maxLength: 55
            },
            details: {
                required: true,
                maxLength: 55
            },
            buy_price: {
                required: true
            },
            min_stock: {
                required: true
            },
            earn: {
                required: true
            },
            size: {
                maxLength: 55,
                required: true
            },
            supplier_id: {
                required: true
            },
            amount: {
                required: open === 'NEW'
            },
            observations: {
                maxLength: 55
            }
        }
    })

    useEffect(() => {
        getSuppliers()
    }, [])

    const headCells = [
        {
            id: 'order_code',
            numeric: false,
            disablePadding: true,
            label: 'Cód. Pedido',
            accessor: 'order_code'
        },
        {
            id: "date",
            numeric: false,
            disablePadding: true,
            label: "Fecha",
            // sorter: (row) => format(new Date(getDeadline(row.date, row.installments)), 'dd/MM/yy'),
            // accessor: (row) => format(new Date(getDeadline(row.date, row.installments)), 'dd/MM/yy')
        },
        {
            id: 'supplier',
            numeric: false,
            disablePadding: true,
            label: 'Proveedor',
            sorter: (row) => row.supplier.name.toLowerCase(),
            accessor: (row) => row.supplier.name
        },
        {
            id: 'supplier_code',
            numeric: false,
            disablePadding: true,
            label: 'Razón Social',
            accessor: "supplier_code"
        },
        {
            id: "entry_date",
            numeric: false,
            disablePadding: true,
            label: "Fecha",
            accessor: "entry_date"
        },
        {
            id: "status",
            numeric: false,
            disablePadding: true,
            label: "Estado",
            accessor: "status"
        },
        {
            id: "seller",
            numeric: false,
            disablePadding: true,
            label: "Vendedor",
            accessor: "seller"
        },
    ]

    return (
        <Layout title="Pedidos">
            <DataGridWithBackendPagination
                loading={loadingProducts || loadingSuppliers || disabled}
                headCells={headCells}
                rows={state.products.data}
                entityKey="products"
                getter={getProducts}
                setOpen={setOpen}
                setFormData={setFormData}
                deadlineColor="pedidos"
                contentHeader={
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2
                    }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="outlined" onClick={() => setOpen('NEW')}>
                                Agregar
                            </Button>
                            <Button variant="outlined" color='success'>
                                Excel
                            </Button>
                        </Box>
                        <OrderFilter />
                    </Box>
                }
            />
        </Layout>
    )
}