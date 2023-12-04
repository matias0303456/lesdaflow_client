import { useContext } from "react";
import { Box, LinearProgress } from "@mui/material";

import { ArticleContext } from "../contexts/ArticleProvider";
import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";

export function Articles() {

    const { articles, loading } = useContext(ArticleContext)

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N°',
            accessor: 'id'
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
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
            id: 'category',
            numeric: false,
            disablePadding: true,
            label: 'Categoría',
            accessor: (row) => row.category.name
        }
    ]

    return (
        <Layout title="Artículos">
            {loading ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid title="Artículos registrados" headCells={headCells} rows={articles} />
            }
        </Layout>
    )
}