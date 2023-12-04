import { useEffect, useState } from "react";
import { Box, LinearProgress } from "@mui/material";

import { DataGrid } from "../components/DataGrid";
import { Layout } from "../components/Layout";
import { useApi } from "../hooks/useApi";

import { USER_URL } from "../utils/urls";

export function Users() {

    const { get } = useApi(USER_URL)

    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setUsers(data)
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
            id: 'first_name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            accessor: 'first_name'
        },
        {
            id: 'last_name',
            numeric: false,
            disablePadding: true,
            label: 'Apellido',
            accessor: 'last_name'
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Email',
            accessor: 'email'
        },
        {
            id: 'role',
            numeric: false,
            disablePadding: true,
            label: 'Rol',
            accessor: (row) => row.role.name
        },
    ]

    return (
        <Layout title="Usuarios">
            {loading ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid title="Usuarios registrados" headCells={headCells} rows={users} />
            }
        </Layout>
    )
}