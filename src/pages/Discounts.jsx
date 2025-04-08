import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useDiscounts } from "../hooks/useDiscounts";
import { useSuppliers } from "../hooks/useSuppliers";
import { useProducts } from "../hooks/useProducts";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { DiscountForm } from "../components/discounts/DiscountForm";

export function Discounts() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const navigate = useNavigate()

    const { getArticles, loadingProducts } = useProducts()
    const { getSuppliers, loadingSuppliers } = useSuppliers()
    const {
        loadingDiscounts,
        handleSubmit,
        handleDelete,
        open,
        setOpen,
        getDiscounts,
        headCells,
        discountFormData,
        discountProducts,
        setDiscountProducts,
        handleClose,
        discountSuppliers,
        setDiscountSuppliers
    } = useDiscounts()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = discountFormData

    useEffect(() => {
        if (auth?.user.role !== "ADMINISTRADOR") {
            navigate(auth?.user.role === 'CHOFER' ? '/prep-ventas' : "/productos");
        } else {
            getSuppliers()
            getArticles()
        }
    }, []);

    useEffect(() => {
        if (open === 'EDIT' || open === 'VIEW') {
            setDiscountProducts(formData.discount_by_products)
            setDiscountSuppliers(formData.discount_by_suppliers)
        }
    }, [open, formData.discount_by_products])

    return (
        <Layout title="Descuentos">
            <DataGridWithBackendPagination
                headCells={headCells}
                loading={loadingDiscounts || loadingSuppliers || loadingProducts || disabled}
                rows={state.discounts.data}
                entityKey="discounts"
                getter={getDiscounts}
                setOpen={setOpen}
                setFormData={setFormData}
                showEditAction
                showDeleteAction
                showViewAction
                contentHeader={
                    <Box>
                        <Button variant="outlined" onClick={() => setOpen('NEW')}>
                            Agregar
                        </Button>
                    </Box>
                }
            >
                <ModalComponent open={open === 'NEW' || open === 'EDIT' || open === 'VIEW'} onClose={handleClose}>
                    <Typography variant="h6" sx={{ marginBottom: 0.5 }}>
                        {open === 'NEW' && 'Nuevo descuento'}
                        {open === 'EDIT' && 'Editar descuento'}
                        {open === 'VIEW' && formData.name}
                    </Typography>
                    <DiscountForm
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        validate={validate}
                        formData={formData}
                        setFormData={setFormData}
                        reset={reset}
                        disabled={disabled}
                        setDisabled={setDisabled}
                        errors={errors}
                        open={open}
                        handleClose={handleClose}
                        discountProducts={discountProducts}
                        setDiscountProducts={setDiscountProducts}
                        discountSuppliers={discountSuppliers}
                        setDiscountSuppliers={setDiscountSuppliers}
                    />
                </ModalComponent>
                <ModalComponent open={open === 'DELETE'} onClose={handleClose} reduceWidth={900}>
                    <Typography variant="h6" marginBottom={1} textAlign="center">
                        Confirmar eliminación de descuento
                    </Typography>
                    <Typography variant="body1" marginBottom={2} textAlign="center">
                        Los datos no podrán recuperarse
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button type="button" variant="outlined" onClick={handleClose} sx={{ width: '35%' }}>
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