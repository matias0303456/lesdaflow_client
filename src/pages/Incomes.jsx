import { useEffect, useState } from "react";
import { Box, LinearProgress } from "@mui/material";

import { Layout } from "../components/Layout";
import { useApi } from "../hooks/useApi";
import { DataGrid } from "../components/DataGrid";

import { INCOME_URL } from "../utils/urls";

export function Incomes() {

    const { get } = useApi(INCOME_URL)

    const [loading, setLoading] = useState(true)
    const [incomes, setIncomes] = useState([])

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setIncomes(data)
                setLoading(false)
            }
        })()
    }, [])

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N°',
            accessor: 'id'
        },
        {
            id: 'article',
            numeric: false,
            disablePadding: true,
            label: 'Artículo',
            accessor: (row) => `${row.article.name} (${row.article.code})`
        },
        {
            id: 'supplier',
            numeric: false,
            disablePadding: true,
            label: 'Proveedor',
            accessor: (row) => row.supplier.name
        },
        {
            id: 'amount',
            numeric: false,
            disablePadding: true,
            label: 'Cantidad',
            accessor: 'amount'
        },
        {
            id: 'price',
            numeric: false,
            disablePadding: true,
            label: 'Precio unitario',
            accessor: (row) => `${row.price} ${row.currency.iso}`
        },
        {
            id: 'discount',
            numeric: false,
            disablePadding: true,
            label: 'Descuento',
            accessor: (row) => `${row.discount} %`
        },
        {
            id: 'total',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            accessor: (row) => `${(row.price * row.amount) - (((row.price * row.amount) / 100) * row.discount)} ${row.currency.iso}`
        },
        {
            id: 'observations',
            numeric: false,
            disablePadding: true,
            label: 'Observaciones',
            accessor: 'observations'
        },
        {
            id: 'created_at',
            numeric: false,
            disablePadding: true,
            label: 'Creado',
            accessor: 'created_at'
        },
        {
            id: 'updated_at',
            numeric: false,
            disablePadding: true,
            label: 'Actualizado',
            accessor: 'updated_at'
        },
    ]

    return (
        <Layout title="Ingresos">
            {loading ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid title="Ingresos registrados" headCells={headCells} rows={incomes} />
            }
        </Layout>
    )
}