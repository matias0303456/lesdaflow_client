import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useSales } from "../hooks/useSales";

import { Layout } from "../components/common/Layout";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { SaleFilter } from "../components/filters/SaleFilter";

import { getSaleTotal } from "../utils/helpers";

export function SalesToDeliver() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const navigate = useNavigate()

    const { loadingSales, setOpen, getSales } = useSales()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            name: '',
            address: '',
            city: '',
            province: '',
            email: '',
            phone: '',
            products: []
        },
        rules: {
            name: {
                required: true,
                maxLength: 55
            },
            address: {
                maxLength: 55
            },
            city: {
                maxLength: 55
            },
            province: {
                maxLength: 55
            },
            email: {
                maxLength: 55
            },
            phone: {
                maxLength: 55
            }
        }
    })

    useEffect(() => {
        if (auth?.user.role !== 'ADMINISTRADOR' && auth?.user.role !== 'CHOFER') navigate('/ventas')
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
            id: 'hour',
            numeric: false,
            disablePadding: true,
            label: 'Hora',
            accessor: (row) => format(new Date(row.date), 'hh:mm')
        },
        {
            id: 'client',
            numeric: false,
            disablePadding: true,
            label: 'Cliente',
            accessor: (row) => `${row.client.first_name} ${row.client.last_name}`
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            accessor: (row) => row.client.address
        },
        {
            id: 'phone',
            numeric: false,
            disablePadding: true,
            label: 'Teléfono',
            accessor: (row) => row.client.local_phone
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: true,
            label: 'Tipo Comp.',
            accessor: (row) => row.type.replaceAll('CUENTA_CORRIENTE', 'CTA CTE')
        },
        {
            id: 'already paid',
            numeric: false,
            disablePadding: true,
            label: 'Pagado',
            accessor: 'already paid'
        },
        {
            id: 'total',
            numeric: true,
            disablePadding: true,
            label: 'Total',
            accessor: (row) => getSaleTotal(row)
        }
    ]

    return (
        <Layout title="Ventas Pendientes Entrega">
            <DataGridWithBackendPagination
                loading={loadingSales || disabled}
                headCells={headCells}
                rows={state.sales.data}
                entityKey="sales"
                getter={getSales}
                setOpen={setOpen}
                setFormData={setFormData}
                showSettingsAction="Registrar entrega"
                contentHeader={<SaleFilter showDateAndType />}
            />
        </Layout>
    )
}