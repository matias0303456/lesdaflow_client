import { Box, LinearProgress } from "@mui/material";

import { useProducts } from "../hooks/useProducts";

import { Layout } from "../components/Layout";
import { DataGrid } from '../components/DataGrid'

import { getStock } from "../utils/helpers";

export function Inventory() {

    const { products, loadingProducts } = useProducts(true)

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N°',
            accessor: 'id'
        },
        {
            id: 'product',
            numeric: false,
            disablePadding: true,
            label: 'Producto',
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
            id: 'details',
            numeric: false,
            disablePadding: true,
            label: 'Detalle',
            accessor: 'details'
        },
        {
            id: 'stock',
            numeric: false,
            disablePadding: true,
            label: 'Stock',
            accessor: (row) => getStock(row)
        }
    ]

    return (
        <Layout title="Inventario">
            {loadingProducts ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    title="Estado actual"
                    headCells={headCells}
                    rows={products}
                    disableAdd
                    disableSelection
                />
            }
        </Layout>
    )
}