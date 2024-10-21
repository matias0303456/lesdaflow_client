import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, FormControl, Autocomplete, TextField } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useProducts } from "../hooks/useProducts";

import { Layout } from "../components/common/Layout";
import { DataGridWithFrontendPagination } from "../components/datagrid/DataGridWithFrontendPagination";

export function ProductHistory() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const navigate = useNavigate()

    const { getProducts, loadingProducts, productHistory, getProductHistory } = useProducts()

    const [value, setValue] = useState('')

    useEffect(() => {
        if (auth?.user.role !== "ADMINISTRADOR") {
            navigate(auth?.user.role === 'CHOFER' ? '/prep-ventas' : "/productos");
        } else {
            getProducts()
        }
    }, []);

    const headCells = [
        {
            id: "idx",
            numeric: false,
            disablePadding: true,
            label: "#",
            accessor: "idx",
        },
        {
            id: "date",
            numeric: false,
            disablePadding: true,
            label: "Fecha",
            accessor: 'date'
        },
        {
            id: "type",
            numeric: false,
            disablePadding: true,
            label: "Tipo",
            accessor: "type"
        },
        {
            id: "created_by",
            numeric: false,
            disablePadding: true,
            label: "Creado por",
            accessor: "created_by"
        }
    ]

    return (
        <Layout title="Historial producto">
            <Box sx={{ backgroundColor: '#FFF' }}>
                <FormControl sx={{ width: '30%' }}>
                    <Autocomplete
                        disablePortal
                        id="product-autocomplete"
                        options={state.products.data.map(p => ({ label: `${p?.code} - ${p?.details}`, id: p?.id }))}
                        noOptionsText="No hay productos disponibles."
                        onChange={(_, value) => getProductHistory(value?.id ?? '')}
                        renderInput={(params) => <TextField {...params} label="Producto *" />}
                        isOptionEqualToValue={(option, value) => option?.code === value?.code || value.length === 0}
                        onInputChange={(e, value) => setValue(value)}
                        value={value}
                        onBlur={() => setValue('')}
                    />
                </FormControl>
                <DataGridWithFrontendPagination
                    loading={loadingProducts}
                    headCells={headCells}
                    rows={productHistory}
                    contentHeader={''}
                />
            </Box>
        </Layout>
    );
}