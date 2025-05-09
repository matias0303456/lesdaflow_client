import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, LinearProgress, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { FiltersContext } from "../providers/FiltersProvider";
import { useProducts } from "../hooks/useProducts";
import { useClients } from '../hooks/useClients'
import { useSales } from "../hooks/useSales";
import { useUsers } from "../hooks/useUsers";
import { useDiscounts } from "../hooks/useDiscounts";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { SaleFilter } from "../components/filters/SaleFilter";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { SaleForm } from "../components/commercial/SaleForm";

import { REPORT_URL } from "../utils/urls";
import { getDeliveredDeadline, getSaleDifference } from "../utils/helpers";

export function Sales() {

    const { auth } = useContext(AuthContext)
    const { state: dataState } = useContext(DataContext)
    const { state: filtersState } = useContext(FiltersContext)

    const navigate = useNavigate()

    const { loadingProducts, getProducts } = useProducts()
    const { loadingClients, getClients } = useClients()
    const { getUsers } = useUsers()
    const { getDiscounts } = useDiscounts()
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
        setIsBlocked,
        discountApplied,
        setDiscountApplied,
        saleFormData,
        headCells
    } = useSales()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = saleFormData

    useEffect(() => {
        if (auth?.user.role !== 'ADMINISTRADOR' && auth?.user.role !== 'VENDEDOR') navigate('/prep-ventas')
    }, [])

    useEffect(() => {
        getClients()
        getProducts()
        getUsers()
        getDiscounts(`?is_available=true`)
    }, [])

    useEffect(() => {
        if ((open === 'EDIT' || open === 'VIEW') && saleProducts.length === 0) {
            setSaleProducts(formData.sale_products)
            setDiscountApplied(dataState.discounts.data.find(d => d.name === formData.discount_name) ?? 'none')
        }
    }, [formData])

    useEffect(() => {
        const currentClient = dataState.clients.data.find(c => c.id === parseInt(formData.client_id))
        const currentClientSales = dataState.sales.data.filter(s => s.client_id === currentClient?.id)
        const someSaleIsPast = currentClientSales.some(s =>
            getDeliveredDeadline(s) < new Date(Date.now()) &&
            parseFloat(getSaleDifference(s).replace('$', '')) > 0
        )
        setIsBlocked(currentClient?.is_blocked || someSaleIsPast)
    }, [formData.client_id])

    useEffect(() => {
        const { page, offset, filters } = filtersState['sales']
        getSales(`?page=${page}&offset=${offset}${filters}`)
    }, [filtersState['sales']])

    return (
        <Layout title="Ventas">
            {(loadingClients || loadingSales || loadingProducts || disabled) ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGridWithBackendPagination
                    headCells={headCells}
                    rows={dataState.sales.data}
                    entityKey="sales"
                    setOpen={setOpen}
                    setFormData={setFormData}
                    showEditAction={auth?.user.role === 'ADMINISTRADOR' || auth?.user.role === 'VENDEDOR'}
                    showDeleteAction={auth?.user.role === 'ADMINISTRADOR'}
                    showPDFAction={`${REPORT_URL}/venta-pdf?token=${auth?.token}&id=`}
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
                        discountApplied={discountApplied}
                        setDiscountApplied={setDiscountApplied}
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
                                window.open(`${REPORT_URL}/venta-pdf?token=${auth?.token}&id=${saleSaved}`, '_blank')
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
            }
        </Layout>
    )
}