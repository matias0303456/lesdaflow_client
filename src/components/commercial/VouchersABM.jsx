/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { Box, Button } from "@mui/material";

import { DataGridWithFrontendPagination } from "../datagrid/DataGridWithFrontendPagination";

export function VouchersABM({
    rows,
    handleCloseSale
}) {

    const headCells = useMemo(() => [
        {
            id: "id",
            numeric: true,
            disablePadding: false,
            label: "N°",
            accessor: 'id'
        },
        {
            id: "cae",
            numeric: false,
            disablePadding: false,
            label: "CAE",
            sorter: (row) => row.cae,
            accessor: (row) => row.cae
        }
    ], [])

    return (
        <>
            <DataGridWithFrontendPagination
                headCells={headCells}
                rows={rows}
            />
            <Box sx={{ textAlign: 'center' }}>
                <Button type="button" variant="outlined" onClick={() => {
                    handleCloseSale()
                }} sx={{ width: '25%' }}>
                    Cerrar
                </Button>
            </Box>
        </>
    )
}