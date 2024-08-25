import { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";
import { format } from "date-fns";

import { AuthContext } from "../../providers/AuthProvider";

import { DataGridWithFrontendPagination } from "../datagrid/DataGridWithFrontendPagination";

import { setLocalDate } from "../../utils/helpers";

export function PaymentsABM({
    sale,
    rows,
    handleCloseSale,
    open,
    setOpen,
    formData,
    reset,
    setFormData,
    handleDelete
}) {

    const { auth } = useContext(AuthContext)

    const headCells = [
        {
            id: "id",
            numeric: true,
            disablePadding: false,
            label: "N°",
            accessor: 'id'
        },
        {
            id: "date",
            numeric: true,
            disablePadding: false,
            label: "Fecha y hora",
            sorter: (row) => format(setLocalDate(new Date(row.date)), 'dd/MM/yy HH:mm'),
            accessor: (row) => format(setLocalDate(new Date(row.date)), 'dd/MM/yy HH:mm')
        },
        {
            id: "amount",
            numeric: true,
            disablePadding: false,
            label: "Importe",
            sorter: (row) => row.amount,
            accessor: (row) => `$${row.amount}`
        },
        {
            id: "type",
            numeric: true,
            disablePadding: false,
            label: "Tipo",
            sorter: (row) => row.type,
            accessor: "type"
        },
        {
            id: "observations",
            numeric: true,
            disablePadding: false,
            label: "Observaciones",
            sorter: (row) => row.observations,
            accessor: "observations"
        }
    ]

    return (
        <>
            <DataGridWithFrontendPagination
                headCells={headCells}
                rows={rows}
                showDeleteAction={auth?.user.role === 'ADMINISTRADOR' && sale.settlement_id === null}
                showEditAction={auth?.user.role === 'ADMINISTRADOR' && sale.settlement_id === null}
                setOpen={setOpen}
                setData={setFormData}
                contentHeader={
                    <>
                        {open === 'DELETE' &&
                            <Box sx={{ marginTop: 1 }}>
                                <Typography variant="body1" color="#F00" textAlign="center">
                                    {`¿Borrar el pago #${formData.id}?`}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginTop: 1 }}>
                                    <Button size="small" variant="contained" onClick={() => handleDelete(formData, reset)}>
                                        Confirmar
                                    </Button>
                                    <Button size="small" variant="outlined" onClick={() => setOpen(null)}>
                                        Cancelar
                                    </Button>
                                </Box>
                            </Box>
                        }
                    </>
                }
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