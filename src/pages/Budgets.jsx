import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { format } from "date-fns";
import { useApi } from "../hooks/useApi";
import { useProducts } from "../hooks/useProducts";
import { useClients } from '../hooks/useClients'
import { useForm } from "../hooks/useForm";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";

import { SALE_URL } from "../utils/urls";

export function Budgets() {

    const { get, post, put, destroy } = useApi(SALE_URL)
    const { products, loadingProducts } = useProducts(true)
    const { clients, loadingClients } = useClients()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            client_id: '',
            discount: '',
            installments: '',
            observations: '',
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
            },
            observations: {
                maxLength: 55
            }
        }
    })

    const [loadingSales, setLoadingSales] = useState(true)
    const [sales, setSales] = useState([])
    const [open, setOpen] = useState(null)
    const [saleProducts, setSaleProducts] = useState([])

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setSales(data[0])
                setLoadingSales(false)
            }
        })()
    }, [])

    useEffect(() => {
        if (open === 'EDIT' || open === 'VIEW') {
            setSaleProducts(formData.sale_products)
        }
    }, [formData])

    const headCells = [
        {
            id: 'budget_code',
            numeric: true,
            disablePadding: false,
            label: 'Cod. Pres.',
            accessor: 'budget_code'
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
            accessor: "hour"
        },
        {
            id: 'seller',
            numeric: false,
            disablePadding: true,
            label: 'Vendedor',
            accessor: "seller"
        },
        {
            id: 'client',
            numeric: false,
            disablePadding: true,
            label: 'Clientes',
            accessor: "client"
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            accessor: "address"
        },
        {
            id: 'total_amount',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            accessor: "total_amount"
        },
    ]

    return (
        <Layout title="Presupuesto">
            <DataGrid
                headCells={headCells}
                // loading={loadingClients || loadingSales || loadingProducts || disabled}
                loading={false}
                rows={[]}
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
                                pdf
                            </Button>
                        </Box>
                        {/* <SaleFilter sales={sales} setSales={setSales} /> */}
                    </Box>
                }
            />
        </Layout>
    )
}