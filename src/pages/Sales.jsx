import { useContext, useEffect } from "react";
import { Box, Button, LinearProgress, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useArticles } from "../hooks/useArticles";
import { useClients } from '../hooks/useClients'
import { useSales } from "../hooks/useSales";
import { useUsers } from "../hooks/useUsers";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { SaleFilter } from "../components/filters/SaleFilter";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { SaleForm } from "../components/commercial/SaleForm";

import { REPORT_URL } from "../utils/urls";

export function Sales() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const {
        loadingSales,
        setSaleArticles,
        open,
        setOpen,
        setMissing,
        setIdsToDelete,
        saleArticles,
        missing,
        idsToDelete,
        saleSaved,
        setSaleSaved,
        handleSubmit,
        handleDelete,
        getSales,
        headCells,
        saleFormData,
        filter,
        setFilter,
        count
    } = useSales()
    const { loadingArticles, getArticles } = useArticles()
    const { loadingClients, getClients } = useClients()
    const { getUsers } = useUsers()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = saleFormData

    useEffect(() => {
        getClients()
        getArticles()
        getUsers()
    }, [])

    useEffect(() => {
        if (open === 'EDIT' || open === 'VIEW') {
            setSaleArticles(formData.sale_articles)
        }
    }, [formData])

    useEffect(() => {
        const { page, offset, client, id, date, type } = filter
        const dateIsNotString = typeof date !== 'string'
        getSales(`?page=${page}&offset=${offset}&client=${client}&id=${id}&date=${dateIsNotString ? new Date(date).toISOString() : ''}&type=${type}`)
    }, [filter])

    return (
        <Layout title="Ventas">
            {(loadingClients || loadingSales || loadingArticles || disabled) ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGridWithBackendPagination
                    headCells={headCells}
                    rows={state.sales}
                    setOpen={setOpen}
                    setFormData={setFormData}
                    filter={filter}
                    setFilter={setFilter}
                    count={count}
                    showEditAction
                    showDeleteAction={auth?.user.role === 'ADMINISTRADOR'}
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
                                {/* <Button variant="outlined" color='success' onClick={() => {
                                window.open(`${REPORT_URL}/sales-excel?token=${auth?.token}`, '_blank')
                            }}>
                                Excel
                            </Button> */}
                            </Box>
                            <SaleFilter filter={filter} setFilter={setFilter} />
                        </Box>
                    }
                >
                    <SaleForm
                        saleArticles={saleArticles}
                        setSaleArticles={setSaleArticles}
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