import { useEffect, useState } from "react";
import { Box, LinearProgress } from "@mui/material";

import { Layout } from "../components/Layout";
import { useApi } from "../hooks/useApi";
import { DataGrid } from "../components/DataGrid";

import { CLIENT_URL } from "../utils/urls";

export function Clients() {

    const { get } = useApi(CLIENT_URL)

    const [loading, setLoading] = useState(true)
    const [clients, setClients] = useState([])

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setClients(data)
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
        <Layout title="Clientes">
            {loading ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid title="Clientes registrados" headCells={headCells} rows={clients} />
            }
        </Layout>
    )
}