import { useEffect, useState } from "react";
import { Box, LinearProgress } from "@mui/material";

import { DataGrid } from "../components/DataGrid";
import { Layout } from "../components/Layout";
import { useApi } from "../hooks/useApi";

import { CATEGORY_URL } from "../utils/urls";

export function Categories() {

    const { get } = useApi(CATEGORY_URL)

    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState([])

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setCategories(data)
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
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            accessor: 'name'
        },
    ]

    return (
        <Layout title="Categorías">
            {loading ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid title="Categorías de artículos" headCells={headCells} rows={categories} />
            }
        </Layout>
    )
}