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

import { getSaleDifference, getSaleTotal } from "../utils/helpers";

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
        if (auth?.user.role !== 'CHOFER') navigate('/productos')
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
            sorter: (row) => format(new Date(row.date), 'HH:mm').toString().replace(':', ''),
            accessor: (row) => format(new Date(row.date), 'HH:mm')
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
            accessor: (row) => row.client.address
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
            label: 'Comp.',
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
            id: 'total',
            numeric: true,
            disablePadding: true,
            label: 'Total',
            sorter: (row) => getSaleTotal(row).replace('$', ''),
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