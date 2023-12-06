import { Box, LinearProgress } from "@mui/material";

import { useArticles } from "../hooks/useArticles";

import { Layout } from "../components/Layout";
import { DataGrid } from '../components/DataGrid'

export function Inventory() {

    const { articles, loadingArticles } = useArticles(true)

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
            accessor: 'name'
        },
        {
            id: 'code',
            numeric: false,
            disablePadding: true,
            label: 'Código',
            accessor: 'code'
        },
        {
            id: 'description',
            numeric: false,
            disablePadding: true,
            label: 'Descripción',
            accessor: 'description'
        },
        {
            id: 'stock',
            numeric: false,
            disablePadding: true,
            label: 'Stock',
            accessor: (row) => row.incomes.reduce((prev, curr) => {
                return prev + curr.amount
            }, 0) - row.outcomes.reduce((prev, curr) => {
                return prev + curr.amount
            }, 0)
        }
    ]

    return (
        <Layout title="Inventario">
            {loadingArticles ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    title="Estado actual"
                    headCells={headCells}
                    rows={articles}
                    disableAdd
                    disableSelection
                />
            }
        </Layout>
    )
}