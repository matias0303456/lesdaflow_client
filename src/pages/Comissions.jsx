import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useSales } from "../hooks/useSales";
import { useForm } from "../hooks/useForm";

import { Layout } from "../components/common/Layout";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { SaleFilter } from "../components/filters/SaleFilter";
import { ModalComponent } from "../components/common/ModalComponent";

import { getSaleDifference, getSaleTotal } from "../utils/helpers";

export function Comissions() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const navigate = useNavigate()

    const {
        loadingSales,
        open,
        setOpen,
        getSales,
        cancelSale
    } = useSales()
    const { formData, setFormData, disabled, reset } = useForm({
        defaultData: {
            id: '',
            client_id: '',
            discount: '',
            type: 'CUENTA_CORRIENTE',
            date: new Date(Date.now()),
            observations: ''
        },
        rules: {
            observations: {
                maxLength: 255
            }
        }
    })

    useEffect(() => {
        if (auth?.user.role !== 'ADMINISTRADOR') navigate(auth?.user.role === 'CHOFER' ? '/prep-ventas' : "/productos")
    }, [])

    const headCells = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: 'Cod. Venta',
            accessor: 'id'
        },
        {
            id: "date",
            numeric: false,
            disablePadding: true,
            label: "Fecha",
            accessor: (row) => format(new Date(row.date), 'dd/MM/yy')
        },
        {
            id: 'client_name',
            numeric: false,
            disablePadding: true,
            label: 'Cliente',
            sorter: (row) => `${row.client.first_name} ${row.client.last_name}`,
            accessor: (row) => `${row.client.first_name} ${row.client.last_name}`
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            sorter: (row) => row.client.address,
            accessor: (row) => (
                <Link target="_blank" to={`https://www.google.com/maps?q=${row.client.address}`}>
                    <span style={{ color: '#078BCD' }}>{row.client.address}</span>
                </Link>
            )
        },
        {
            id: 'phone',
            numeric: false,
            disablePadding: true,
            label: 'Teléfono',
            sorter: (row) => row.client.local_phone.toString(),
            accessor: (row) => row.client.local_phone
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: true,
            label: 'T. Vta.',
            accessor: (row) => row.type.replaceAll('CUENTA_CORRIENTE', 'CTA CTE')
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
            sorter: (row) => row.is_delivered ? 1 : 0,
            accessor: (row) => row.is_delivered ? 'Sí' : 'No'
        },
        {
            id: 'total',
            numeric: true,
            disablePadding: true,
            label: 'Total',
            sorter: (row) => getSaleTotal(row).replace('$', ''),
            accessor: (row) => getSaleTotal(row)
        }
    ]

    return (
        <Layout title="Comisiones">
            <DataGridWithBackendPagination
                loading={loadingSales || disabled}
                headCells={headCells}
                rows={state.sales.data}
                entityKey="sales"
                getter={getSales}
                setOpen={setOpen}
                setFormData={setFormData}
                showSettingsAction="Registrar cancelación"
                showEditAction
                contentHeader={<SaleFilter showDate width={{ main: '100%', client: '15%', id: '15%', date: '15%', btn: '10%' }} />}
            />
            <ModalComponent open={open === 'SETTINGS'} onClose={() => setOpen(null)} reduceWidth={900}>
                <Typography variant="h6" marginBottom={1} textAlign="center">
                    Confirmar cancelación de venta
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button type="button" variant="outlined" onClick={() => setOpen(null)} sx={{ width: '35%' }}>
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        disabled={disabled}
                        sx={{ width: '35%' }}
                        onClick={() => cancelSale(formData, reset)}
                    >
                        Confirmar
                    </Button>
                </Box>
            </ModalComponent>
        </Layout>
    );
}