import { useContext, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useProducts } from "../hooks/useProducts";
import { useClients } from '../hooks/useClients'
import { useForm } from "../hooks/useForm";
import { useSales } from "../hooks/useSales";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { SaleFilter } from "../components/filters/SaleFilter";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { SaleForm } from "../components/commercial/SaleForm";

import { REPORT_URL } from "../utils/urls";
import { getSaleTotal } from "../utils/helpers";

export function Sales() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const {
        loadingSales,
        setSaleProducts,
        open,
        setOpen,
        setMissing,
        setIdsToDelete,
        saleProducts,
        missing,
        idsToDelete,
        saleSaved,
        setSaleSaved,
        handleSubmit,
        handleDelete,
        getSales
    } = useSales()
    const { loadingProducts, getProducts } = useProducts()
    const { loadingClients, getClients } = useClients()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            client_id: '',
            discount: '',
            installments: '',
            type: 'CUENTA_CORRIENTE',
            date: new Date(Date.now())
        },
        rules: {
            client_id: {
                required: true
            },
            date: {
                required: true
            },
            installments: {
                required: true
            }
        }
    })

    useEffect(() => {
        getClients()
        getProducts()
    }, [])

    useEffect(() => {
        if (open === 'EDIT' || open === 'VIEW') {
            setSaleProducts(formData.sale_products)
        }
    }, [formData])

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Cod. Venta',
            accessor: 'id'
        },
        {
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha',
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
            id: 'created_by',
            numeric: false,
            disablePadding: true,
            label: 'Vendedor',
            accessor: 'created_by'
        },
        {
            id: 'client',
            numeric: false,
            disablePadding: true,
            label: 'Cliente',
            accessor: (row) => `${row.client.first_name} ${row.client.last_name}`
        },
        {
            id: 'work_place',
            numeric: false,
            disablePadding: true,
            label: 'Comercio',
            accessor: (row) => row.client.work_place
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            accessor: (row) => row.client.address
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: true,
            label: 'Tipo Comprobante',
            accessor: 'type'
        },
        {
            id: 'paid',
            numeric: false,
            disablePadding: true,
            label: 'Pagado',
            accessor: (row) => ''
        },
        {
            id: 'total',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            accessor: (row) => getSaleTotal(row)
        },
        {
            id: 'register',
            numeric: false,
            disablePadding: true,
            label: 'Caja',
            accessor: (row) => ''
        },
        {
            id: 'delivered',
            numeric: false,
            disablePadding: true,
            label: 'Entregado',
            accessor: (row) => ''
        },
        {
            id: 'imp',
            numeric: false,
            disablePadding: true,
            label: 'Imp',
            accessor: (row) => ''
        },
    ]

    return (
        <Layout title="Ventas">
            <DataGridWithBackendPagination
                loading={loadingClients || loadingSales || loadingProducts || disabled}
                headCells={headCells}
                rows={state.sales.data}
                entityKey="sales"
                getter={getSales}
                setOpen={setOpen}
                setFormData={setFormData}
                showEditAction={auth.user.role === 'ADMINISTRADOR'}
                showDeleteAction={auth.user.role === 'ADMINISTRADOR'}
                showViewAction
                showPDFAction
                contentHeader={
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="outlined" onClick={() => setOpen('NEW')}>
                                Agregar
                            </Button>
                            <Button variant="outlined" color='success'>
                                Excel
                            </Button>
                        </Box>
                        <SaleFilter showWorkPlace showSeller />
                    </Box>
                }
            >
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
                />
                <ModalComponent
                    reduceWidth={800}
                    open={saleSaved !== null}
                    onClose={() => setSaleSaved(null)}
                >
                    <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2 }}>
                        Venta creada correctamente
                    </Typography>
                    <Button type="submit" variant="contained"
                        sx={{
                            width: '50%',
                            display: 'block',
                            margin: '0 auto'
                        }}
                        onClick={() => {
                            window.open(`${REPORT_URL}/account-details/${auth.token}/${saleSaved}`, '_blank')
                            setSaleSaved(null)
                        }}
                    >
                        Compartir comprobante
                    </Button>
                </ModalComponent>
                <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)} reduceWidth={900}>
                    <Typography variant="h6" marginBottom={1} textAlign="center">
                        Confirmar eliminación de venta
                    </Typography>
                    <Typography variant="body1" marginBottom={2} textAlign="center">
                        Los datos no podrán recuperarse
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{ width: '35%' }}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            disabled={disabled}
                            sx={{ width: '35%' }}
                            onClick={() => handleDelete(formData)}
                        >
                            Confirmar
                        </Button>
                    </Box>
                </ModalComponent>
            </DataGridWithBackendPagination>
        </Layout>
    )
}