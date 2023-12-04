import { useEffect, useState } from "react";
import { Box, LinearProgress } from "@mui/material";

import { Layout } from "../components/Layout";
import { useApi } from "../hooks/useApi";
import { DataGrid } from "../components/DataGrid";

import { OUTCOME_URL } from "../utils/urls";

export function Outcomes() {

    const { get } = useApi(OUTCOME_URL)

    const [loading, setLoading] = useState(true)
    const [outcomes, setOutcomes] = useState([])

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setOutcomes(data)
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
            id: 'client',
            numeric: false,
            disablePadding: true,
            label: 'Cliente',
            accessor: (row) => row.client.name
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
        <Layout title="Egresos">
            {loading ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid title="Egresos registrados" headCells={headCells} rows={outcomes} />
            }
        </Layout>
    )
}