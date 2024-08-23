/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";

import { DataGridWithFrontendPagination } from '../datagrid/DataGridWithFrontendPagination';

import { getSaleTotal } from '../../utils/helpers';

export function ThirdSection({ calculations }) {

    const salesHeadCells = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: 'Bol.',
            accessor: 'id'
        },
        {
            id: 'client',
            numeric: false,
            disablePadding: true,
            label: 'Cliente',
            accessor: (row) => (
                <Box>
                    <Typography variant="body1">{row.client.first_name} {row.client.last_name}</Typography>
                    <Typography variant="body2">{row.client.work_place}</Typography>
                </Box>
            )
        },
        {
            id: 'amount',
            numeric: false,
            disablePadding: true,
            label: 'Monto',
            accessor: (row) => getSaleTotal(row)
        }
    ]

    return (
        <Box className="w-[100%]">
            <Typography
                variant="h6"
                sx={{
                    width: "100%",
                    fontSize: "14px",
                    color: "white",
                    paddingX: "10px",
                    paddingY: "5px",
                    backgroundColor: "#078BCD",
                    borderRadius: "2px",
                    fontWeight: "bold",
                }}
            >
                Boletas
            </Typography>
            <Box sx={{
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'center',
                flexWrap: 'wrap',
                mt: 1,
                gap: { xs: 1, lg: 3 }
            }}>
                <Box sx={{ width: { xs: '100%', lg: '30%' } }}>
                    <Typography variant="h6">
                        Cuentas corrientes
                    </Typography>
                    <DataGridWithFrontendPagination
                        headCells={salesHeadCells}
                        rows={calculations['CUENTA_CORRIENTE'].sales}
                        minWidth={0}
                        labelRowsPerPage="Reg. Página"
                    />
                    <Typography variant="h6" align="right">
                        Total: {calculations['CUENTA_CORRIENTE'].total}
                    </Typography>
                    <Typography variant="h6" align="right">
                        Comisión: {calculations['CUENTA_CORRIENTE'].commission}
                    </Typography>
                </Box>
                <Box sx={{ width: { xs: '100%', lg: '30%' } }}>
                    <Typography variant="h6">
                        Contado
                    </Typography>
                    <DataGridWithFrontendPagination
                        headCells={salesHeadCells}
                        rows={calculations['CONTADO'].sales}
                        minWidth={0}
                        labelRowsPerPage="Reg. Página"
                    />
                    <Typography variant="h6" align="right">
                        Total: {calculations['CONTADO'].total}
                    </Typography>
                    <Typography variant="h6" align="right">
                        Comisión: {calculations['CONTADO'].commission}
                    </Typography>
                </Box>
                <Box sx={{ width: { xs: '100%', lg: '30%' } }}>
                    <Typography variant="h6">
                        Poxipol
                    </Typography>
                    <DataGridWithFrontendPagination
                        headCells={salesHeadCells}
                        rows={calculations['POXIPOL'].sales}
                        minWidth={0}
                        labelRowsPerPage="Reg. Página"
                    />
                    <Typography variant="h6" align="right">
                        Total: {calculations['POXIPOL'].total}
                    </Typography>
                    <Typography variant="h6" align="right">
                        Comisión: {calculations['POXIPOL'].commission}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}