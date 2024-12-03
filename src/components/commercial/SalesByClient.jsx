import { useContext, useEffect } from "react"
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material"
import PictureAsPdfSharpIcon from '@mui/icons-material/PictureAsPdfSharp'
import { format } from "date-fns"

import { AuthContext } from "../../providers/AuthProvider"
import { useSales } from "../../hooks/useSales"

import { DataGridWithFrontendPagination } from "../datagrid/DataGridWithFrontendPagination"

import { getSaleDifference, getSaleTotal } from "../../utils/helpers"
import { REPORT_URL } from "../../utils/urls"

export function SalesByClient({ formData, handleClose }) {

    const { auth } = useContext(AuthContext)

    const { getSalesByClient, salesByClient } = useSales()

    useEffect(() => {
        if (formData.id) getSalesByClient(formData.id)
    }, [])

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Cód.',
            accessor: 'id'
        },
        {
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha',
            accessor: (row) => format(new Date(row.date), 'dd/MM/yy')
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: true,
            label: 'T. Vta.',
            accessor: (row) => row.type.replaceAll('CUENTA_CORRIENTE', 'CTA CTE')
        },
        {
            id: 'total',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            sorter: (row) => getSaleTotal(row).replace('$', ''),
            accessor: (row) => getSaleTotal(row)
        },
        {
            id: 'paid',
            numeric: false,
            disablePadding: true,
            label: 'Pagado',
            sorter: (row) => parseFloat(getSaleDifference(row).replace('$', '')) > 0 ? 1 : 0,
            accessor: (row) => parseFloat(getSaleDifference(row).replace('$', '')) > 0 ? 'No' : 'Sí'
        },
        {
            id: 'delivered',
            numeric: false,
            disablePadding: true,
            label: 'Entregado',
            sorter: (row) => row.is_delivered ? format(new Date(row.delivered_at), 'dd/MM/yy') : 'No',
            accessor: (row) => row.is_delivered ? format(new Date(row.delivered_at), 'dd/MM/yy') : 'No'
        }
    ]

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                    {`Vendedor: ${formData?.user?.name}`}
                </Typography>
                <Tooltip
                    title="Imprimir PDF"
                    onClick={() => window.open(`${REPORT_URL}/sales-by-client/${auth?.token}/${formData.id}`, '_blank')}
                >
                    <IconButton className="rounded-full bg-black/20 opacity-50 hover:bg-[#288bcd] hover:text-white">
                        <PictureAsPdfSharpIcon className="w-4 h-4" />
                    </IconButton>
                </Tooltip>
            </Box>
            <DataGridWithFrontendPagination
                headCells={headCells}
                rows={salesByClient}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                <Button type="button" variant="outlined" onClick={handleClose} sx={{ width: '25%' }}>
                    Cerrar
                </Button>
            </Box>
        </>
    )
}