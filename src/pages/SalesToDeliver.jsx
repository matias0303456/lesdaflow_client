import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useSales } from "../hooks/useSales";
import { useProducts } from "../hooks/useProducts";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/common/Layout";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { SaleFilter } from "../components/filters/SaleFilter";
import { SaleForm } from "../components/commercial/SaleForm";

import { getSaleDifference, getSaleTotal } from "../utils/helpers";
import { REPORT_URL } from "../utils/urls";
import { ModalComponent } from "../components/common/ModalComponent";
import { Box, Button, Typography } from "@mui/material";

export function SalesToDeliver() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const navigate = useNavigate()

    const {
        loadingSales,
        open,
        setOpen,
        getSales,
        saleProducts,
        setSaleProducts,
        missing,
        setMissing,
        idsToDelete,
        setIdsToDelete,
        handleSubmit,
        isBlocked,
        setIsBlocked,
        deliverSale
    } = useSales()
    const { getProducts } = useProducts()
    const { getClients } = useClients()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
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
        if (auth?.user.role !== 'CHOFER') navigate('/productos')
    }, [])

    useEffect(() => {
        getProducts()
        getClients()
    }, [])

    useEffect(() => {
        if (open === 'EDIT') {
            setSaleProducts(formData.sale_products)
        }
    }, [formData])

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
        <Layout title="Ventas Pendientes Entrega">
            <DataGridWithBackendPagination
                loading={loadingSales || disabled}
                headCells={headCells}
                rows={state.sales.data}
                entityKey="sales"
                getter={getSales}
                setOpen={setOpen}
                setFormData={setFormData}
                showPDFAction={`${REPORT_URL}/sales-pdf-or-puppeteer?token=${auth?.token}&id=`}
                showSettingsAction="Registrar entrega"
                showEditAction
                contentHeader={<SaleFilter showDateAndType />}
            />
            <SaleForm
                saleProducts={saleProducts}
                setSaleProducts={setSaleProducts}
                missing={missing}
                setMissing={setMissing}
                reset={reset}
                open={open}
                setOpen={setOpen}
                idsToDelete={idsToDelete}
                setIdsToDelete={setIdsToDelete}
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                validate={validate}
                disabled={disabled}
                setDisabled={setDisabled}
                handleChange={handleChange}
                errors={errors}
                isBlocked={isBlocked}
                setIsBlocked={setIsBlocked}
            />
            <ModalComponent open={open === 'SETTINGS'} onClose={() => setOpen(null)} reduceWidth={900}>
                <Typography variant="h6" marginBottom={1} textAlign="center">
                    Confirmar entrega de venta
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
                        onClick={() => deliverSale(formData, reset)}
                    >
                        Confirmar
                    </Button>
                </Box>
            </ModalComponent>
        </Layout>
    )
}