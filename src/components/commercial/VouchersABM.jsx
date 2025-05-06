/* eslint-disable react/prop-types */
import { Box, Button } from "@mui/material";

import { DataGridWithFrontendPagination } from "../datagrid/DataGridWithFrontendPagination";
import { useVouchers } from "../../hooks/useVouchers";

export function VouchersABM({ rows, handleCloseSale }) {

    const { headCells } = useVouchers()

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