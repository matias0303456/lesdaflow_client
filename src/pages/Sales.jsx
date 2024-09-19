import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useProducts } from "../hooks/useProducts";
import { useClients } from '../hooks/useClients'
import { useForm } from "../hooks/useForm";
import { useSales } from "../hooks/useSales";
import { useUsers } from "../hooks/useUsers";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { SaleFilter } from "../components/filters/SaleFilter";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { SaleForm } from "../components/commercial/SaleForm";

import { REPORT_URL } from "../utils/urls";
import { deadlineIsPast, getSaleDifference, getSaleTotal } from "../utils/helpers";

export function Sales() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const navigate = useNavigate()

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
        getSales,
        isBlocked,
        setIsBlocked
    } = useSales()
    const { loadingProducts, getProducts } = useProducts()
    const { loadingClients, getClients } = useClients()
    const { getUsers } = useUsers()
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
            client_id: {
                required: true
            },
            date: {
                required: true
            },
            observations: {
                maxLength: 255
            }
        }
    })

    useEffect(() => {
        if (auth?.user.role !== 'ADMINISTRADOR' && auth?.user.role !== 'VENDEDOR') navigate('/prep-ventas')
    }, [])

    useEffect(() => {
        getClients()
        getProducts()
        getUsers()
    }, [])

    useEffect(() => {
        if (open === 'EDIT' || open === 'VIEW') {
            setSaleProducts(formData.sale_products)
        }
    }, [formData])

    useEffect(() => {
        const currentClient = state.clients.data.find(c => c.id === parseInt(formData.client_id))
        const currentClientSales = state.sales.data.filter(s => s.client_id === currentClient?.id)
        const someSaleIsPast = currentClientSales.some(s => deadlineIsPast(s))
        setIsBlocked(currentClient?.is_blocked || someSaleIsPast)
    }, [formData.client_id])

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Cód.',
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
            id: 'seller',
            numeric: false,
            disablePadding: true,
            label: 'Vdor.',
            sorter: (row) => auth?.user.role === 'ADMINISTRADOR' ? row.created_by : row.client.user.name,
            accessor: (row) => auth?.user.role === 'ADMINISTRADOR' ? row.created_by : row.client.user.name
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
            id: 'work_place',
            numeric: false,
            disablePadding: true,
            label: 'Comercio',
            sorter: (row) => row.client.work_place ?? '',
            accessor: (row) => row.client.work_place
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Direcc.',
            sorter: (row) => row.client.address,
            accessor: (row) => (
                <Link target="_blank" to={`https://www.google.com/maps?q=${row.client.address}`}>
                    <span style={{ color: '#078BCD' }}>{row.client.address}</span>
                </Link>
            )
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: true,
            label: 'T. Vta.',
            accessor: (row) => row.type.replaceAll('CUENTA_CORRIENTE', 'CTA CTE')
        },
        {
            id: 'total',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            sorter: (row) => getSaleTotal(row).replace('$', ''),
            accessor: (row) => getSaleTotal(row)
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
        }
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
                showEditAction={auth?.user.role === 'ADMINISTRADOR' || auth?.user.role === 'VENDEDOR'}
                showDeleteAction={auth?.user.role === 'ADMINISTRADOR'}
                showPDFAction={`${REPORT_URL}/sales-pdf-or-puppeteer?token=${auth?.token}&id=`}
                showViewAction
                contentHeader={
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: '20%' } }}>
                            <Button variant="outlined" onClick={() => {
                                reset()
                                setOpen('NEW')
                            }}>
                                Agregar
                            </Button>
                            <Button variant="outlined" color='success' onClick={() => {
                                window.open(`${REPORT_URL}/sales-excel?token=${auth?.token}`, '_blank')
                            }}>
                                Excel
                            </Button>
                        </Box>
                        <SaleFilter
                            showWorkPlace
                            showSeller={auth?.user.role === 'ADMINISTRADOR' || auth?.user.role === 'CHOFER'}
                            showType
                            width={{
                                main: { xs: '100%', md: '80%' },
                                client: { xs: '100%', md: '15%' },
                                id: { xs: '100%', md: '15%' },
                                date: { xs: '100%', md: '15%' },
                                btn: { xs: '100%', md: '10%' },
                                work_place: { xs: '100%', md: '15%' },
                                seller: { xs: '100%', md: '15%' },
                                type: { xs: '100%', md: '15%' }
                            }}
                        />
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
                    isBlocked={isBlocked}
                    setIsBlocked={setIsBlocked}
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
                            window.open(`${REPORT_URL}/sales-pdf-or-puppeteer?token=${auth?.token}&id=${saleSaved}`, '_blank')
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