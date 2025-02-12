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
import { DiscountForm } from "../components/dicounts/DiscountForm";

export function Discounts() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const navigate = useNavigate()

    const { getProducts, loadingProducts } = useProducts()
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
        setDiscountProducts
    } = useDiscounts()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = discountFormData

    useEffect(() => {
        if (auth?.user.role !== "ADMINISTRADOR") {
            navigate(auth?.user.role === 'CHOFER' ? '/prep-ventas' : "/productos");
        } else {
            getSuppliers()
            getProducts()
        }
    }, []);

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
                <ModalComponent open={open === 'NEW' || open === 'EDIT' || open === 'VIEW'} onClose={() => reset(setOpen)}>
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
                        setOpen={setOpen}
                        discountProducts={discountProducts}
                        setDiscountProducts={setDiscountProducts}
                        products={state.products.data}
                    />
                </ModalComponent>
                <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)} reduceWidth={900}>
                    <Typography variant="h6" marginBottom={1} textAlign="center">
                        Confirmar eliminación de cliente
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