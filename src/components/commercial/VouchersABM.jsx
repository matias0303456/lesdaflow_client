/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { Box, Button } from "@mui/material";

import { DataGridWithFrontendPagination } from "../datagrid/DataGridWithFrontendPagination";

export function VouchersABM({ rows, handleCloseSale }) {

    const headCells = useMemo(() => [
        {
            id: "id",
            numeric: true,
            disablePadding: false,
            label: "#",
            accessor: 'id'
        },
        {
            id: "number",
            numeric: false,
            disablePadding: false,
            label: "N°",
            sorter: 'number',
            accessor: 'number'
        },
        {
            id: "cae",
            numeric: false,
            disablePadding: false,
            label: "CAE",
            sorter: 'cae',
            accessor: 'cae'
        },
        {
            id: "type",
            numeric: false,
            disablePadding: false,
            label: "Tipo",
            sorter: 'type',
            accessor: 'type'
        },
        {
            id: "sale_point",
            numeric: false,
            disablePadding: false,
            label: "P. de venta",
            sorter: 'sale_point',
            accessor: 'sale_point'
        },
    ], [])

    return (
        <>
            <DataGridWithFrontendPagination
                headCells={headCells}
                rows={rows}
            />
            <Box sx={{ textAlign: 'center' }}>
                <Button type="button" variant="outlined" onClick={() => handleCloseSale()} sx={{ width: '25%' }}>
                    Cerrar
                </Button>
            </Box>
        </>
    )
}