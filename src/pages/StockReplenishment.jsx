import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useClients } from "../hooks/useClients";
import { useProducts } from "../hooks/useProducts";
import { useSuppliers } from "../hooks/useSuppliers";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";

import { Layout } from "../components/common/Layout";
import { DataGridWithFrontendPagination } from "../components/datagrid/DataGridWithFrontendPagination";
import { ProductFilter } from "../components/filters/ProductFilter";

import { CLIENT_URL, PRODUCT_URL } from "../utils/urls";

export function StockReplenishment() {

  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();

  const {
    formData,
    setFormData,
    handleChange,
    disabled,
    setDisabled,
    validate,
    reset,
    errors,
  } = useForm({
    defaultData: {},
    rules: {},
  });

  const { products, setProducts, loadingProducts, setLoadingProducts, setOpen } = useProducts()
  const { suppliers, loadingSuppliers } = useSuppliers()

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/productos");
  }, []);

  const headCells = [
    {
      id: "date",
      numeric: false,
      disablePadding: true,
      label: "Fecha",
      accessor: "date",
    },
    {
      id: "sale_code",
      numeric: false,
      disablePadding: true,
      label: "Cod. Venta",
      accessor: "sale_code",
    },
    {
      id: "sale_details",
      numeric: false,
      disablePadding: true,
      label: "Detalle Venta",
      accessor: "sale_details",
    },
    {
      id: "product",
      numeric: false,
      disablePadding: true,
      label: "Producto",
      accessor: "product",
    },
    {
      id: "rep_amount",
      numeric: false,
      disablePadding: true,
      label: "Cantidad Rep.",
      accessor: "rep_amount",
    },
  ];

  return (
    <Layout title="Reposicion Stock">
      <DataGridWithFrontendPagination
        loading={loadingProducts || loadingSuppliers}
        headCells={headCells}
        rows={[]}
        setOpen={setOpen}
        setFormData={setFormData}
        contentHeader={
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                size="medium"
                onClick={() => setOpen("NEW")}
              >
                Agregar
              </Button>
              <Button variant="outlined" size="medium" color="success">
                Excel
              </Button>
              <Button variant="outlined" size="medium" color="error">
                Pdf
              </Button>
            </Box>
            {/* <ProductFilter
                products={products}
                setProducts={setProducts}
                suppliers={suppliers}
              /> */}
          </Box>
        }
      ></DataGridWithFrontendPagination>
    </Layout>
  );
}
