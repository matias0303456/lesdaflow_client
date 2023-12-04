import { useEffect, useState } from "react";
import { Box, LinearProgress } from "@mui/material";

import { Layout } from "../components/Layout";
import { useApi } from "../hooks/useApi";
import { DataGrid } from "../components/DataGrid";

import { SUPPLIER_URL } from "../utils/urls";

export function Suppliers() {

    const { get } = useApi(SUPPLIER_URL)

    const [loading, setLoading] = useState(true)
    const [suppliers, setSuppliers] = useState([])

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setSuppliers(data)
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
        {
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Email',
            accessor: 'email'
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            accessor: 'address'
        },
        {
            id: 'city',
            numeric: false,
            disablePadding: true,
            label: 'Ciudad',
            accessor: 'city'
        },
        {
            id: 'province',
            numeric: false,
            disablePadding: true,
            label: 'Provincia',
            accessor: 'province'
        },
        {
            id: 'country',
            numeric: false,
            disablePadding: true,
            label: 'País',
            accessor: (row) => row.country.name
        }
    ]

    return (
        <Layout title="Proveedores">
            {loading ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid title="Proveedores de artículos" headCells={headCells} rows={suppliers} />
            }
        </Layout>
    )
}