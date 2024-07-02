import { useContext, useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import { Box, Button, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";

import { Layout } from "../components/common/Layout";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";

import { usePayments } from "../hooks/usePayments";
import { getCommissionValueByPayment } from "../utils/helpers";
import { useUsers } from "../hooks/useUsers";
import { ModalComponent } from "../components/common/ModalComponent";
import { PaymentFilter } from "../components/filters/PaymentFilter";

export function Comissions() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const navigate = useNavigate()

    const { getPayments, cancelPayment, loadingPayments, open, setOpen } = usePayments()
    const { getUsers, loadingUsers } = useUsers()
    const { formData, setFormData, disabled } = useForm({ defaultData: {}, rules: {} })

    useEffect(() => {
        if (auth?.user.role !== 'ADMINISTRADOR') {
            navigate(auth?.user.role === 'CHOFER' ? '/prep-ventas' : "/productos")
        } else {
            getUsers()
        }
    }, [])

    const headCells = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: 'N° pago',
            accessor: 'id'
        },
        {
            id: 'sale_id',
            numeric: false,
            disablePadding: true,
            label: 'N° venta',
            accessor: 'sale_id'
        },
        {
            id: "date",
            numeric: false,
            disablePadding: true,
            label: "Fecha",
            accessor: (row) => format(new Date(row.date), 'dd/MM/yy')
        },
        {
            id: 'amount',
            numeric: false,
            disablePadding: true,
            label: 'Importe',
            accessor: (row) => `$${row.amount}`
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: true,
            label: 'Tipo pago',
            accessor: 'type'
        },
        {
            id: 'sale_type',
            numeric: false,
            disablePadding: true,
            label: 'Tipo vta.',
            sorter: (row) => row.sale.type.replace('CUENTA_CORRIENTE', 'CTA CTE'),
            accessor: (row) => row.sale.type.replace('CUENTA_CORRIENTE', 'CTA CTE')
        },
        {
            id: 'observations',
            numeric: false,
            disablePadding: true,
            label: 'Observaciones',
            sorter: (row) => row.observations ?? '',
            accessor: 'observations'
        },
        {
            id: 'created_by',
            numeric: false,
            disablePadding: true,
            label: 'Registrado por',
            accessor: 'created_by'
        },
        {
            id: 'commission',
            numeric: false,
            disablePadding: true,
            label: 'Comisión',
            sorter: (row) => getCommissionValueByPayment(row, state.users.data.find(u => u.username === row.created_by)),
            accessor: (row) => `$${getCommissionValueByPayment(row, state.users.data.find(u => u.username === row.created_by))}`
        },
        {
            id: 'is_canceled',
            numeric: false,
            disablePadding: true,
            label: 'Cancelado',
            sorter: (row) => row.is_canceled ? 1 : 0,
            accessor: (row) => (
                <Box sx={{ textAlign: 'center' }}>
                    <FormControlLabel
                        control={<Checkbox />}
                        checked={row.is_canceled}
                        onChange={e => {
                            setFormData({
                                ...row,
                                is_canceled: e.target.checked
                            })
                            setOpen(true)
                        }}
                    />
                </Box>
            )
        }
    ]

    return (
        <Layout title="Comisiones">
            <DataGridWithBackendPagination
                loading={loadingPayments || loadingUsers || disabled}
                headCells={headCells}
                rows={state.payments.data}
                entityKey="payments"
                getter={getPayments}
                setFormData={setFormData}
                contentHeader={<PaymentFilter />}
            />
            <ModalComponent open={open} onClose={() => setOpen(null)} reduceWidth={900}>
                <Typography variant="h6" align="center" marginBottom={2}>
                    {`Se marcará el pago n° ${formData.id} como ${formData.is_canceled ? '' : 'no'} cancelado.`}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button type="button" variant="outlined" onClick={() => setOpen(null)}>
                        Cancelar
                    </Button>
                    <Button type="button" variant="contained" onClick={() => cancelPayment(formData)}>
                        Confirmar
                    </Button>
                </Box>
            </ModalComponent>
        </Layout>
    )
}