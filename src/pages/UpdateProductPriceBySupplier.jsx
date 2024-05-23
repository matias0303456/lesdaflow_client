import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Input,
  FormControl,
  InputLabel,
  Typography
} from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "../hooks/useForm";
import { useSuppliers } from "../hooks/useSuppliers";

import { Layout } from "../components/Layout";
import { DataGridWithBackendPagination } from "../components/DataGridWithBackendPagination";

import { getProductNewSalePriceByPercentage, getProductSalePrice } from "../utils/helpers";

export function UpdateProductPriceBySupplier() {

  const { auth } = useContext(AuthContext);

  const navigate = useNavigate()
  const { suppliers, loadingSuppliers, handleSubmitMassive } = useSuppliers()
  const {
    formData,
    handleChange,
    disabled,
    setDisabled,
    validate,
    reset,
    errors,
  } = useForm({
    defaultData: { id: '', percentage: 0.00, products: [] },
    rules: { id: { required: true }, percentage: { required: true } },
  });

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/productos");
  }, []);

  const headCells = [
    {
      id: "code",
      numeric: false,
      disablePadding: true,
      label: "Cod.",
      accessor: "code",
    },
    {
      id: "details",
      numeric: false,
      disablePadding: true,
      label: "Producto",
      accessor: "details",
    },
    {
      id: "sale_price",
      numeric: false,
      disablePadding: true,
      label: "Precio Actual (venta)",
      accessor: (row) => `$${getProductSalePrice(row).toFixed(2)}`
    },
    {
      id: "new_price",
      numeric: false,
      disablePadding: true,
      label: "Precio Nuevo (venta)",
      accessor: (row) => `$${getProductNewSalePriceByPercentage(row, formData.percentage).toFixed(2)}`
    }
  ]

  return (
    <Layout title="Actualizar Precios Productos">
      <Box className="w-[50%] mb-3 bg-white rounded-md">
        <Typography
          variant="h6"
          sx={{
            width: "100%",
            fontSize: "14px",
            color: "white",
            backgroundColor: "#078BCD",
            padding: 1,
            borderRadius: "2px",
            fontWeight: "bold",
          }}
        >
          Información General
        </Typography>
        <form>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "start",
              padding: 1,
              paddingBottom: 2,
              gap: 1
            }}
          >
            <FormControl
              variant="standard"
              sx={{
                minWidth: "100%",
                color: "#59656b",
                display: "flex",
                alignItems: "start",
                justifyContent: "center"
              }}
            >
              <InputLabel htmlFor="id" className="font-semibold text-gray-400 text-sm">
                Proveedor
              </InputLabel>
              <Select
                labelId="supplier-select"
                id="id"
                value={formData.id}
                label="Proveedor"
                name="id"
                sx={{ width: "100%" }}
                onChange={(e) => handleChange({ target: { name: 'id', value: e.target.value } })}
              >
                {suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>No se encontraron resultados</MenuItem>
                )}
              </Select>
              {errors.id?.type === 'required' &&
                <Typography variant="caption" color="red" marginTop={1}>
                  * El proveedor es requerido.
                </Typography>
              }
            </FormControl>
            <Box className="w-[100%] flex items-center justify-start gap-2">
              <FormControl
                variant="standard"
                sx={{
                  width: "40%",
                  color: "#59656b",
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "center",
                  marginTop: "2rem",
                }}
              >
                <InputLabel htmlFor="percentage" className="font-semibold text-gray-400 text-sm">
                  Porcentaje
                </InputLabel>
                <Input
                  className="w-full"
                  type="number"
                  value={formData.percentage}
                  onChange={(e) => handleChange({ target: { name: 'percentage', value: e.target.value } })}
                />
                {errors.percentage?.type === 'required' &&
                  <Typography variant="caption" color="red" marginTop={1}>
                    * El porcentaje es requerido.
                  </Typography>
                }
              </FormControl>
            </Box>
          </Box>
        </form>
      </Box>
      <Box className="w-[50%] flex items-center justify-start gap-2  mb-4">
        <Button
          variant="contained"
          size="medium"
          disabled={disabled}
          onClick={(e) => handleSubmitMassive(e, validate, formData, reset, setDisabled)}
        >
          Confirmar
        </Button>
        <Button variant="outlined" size="medium" onClick={() => navigate('/productos')}>
          Volver
        </Button>
      </Box>
      <DataGridWithBackendPagination
        loading={loadingSuppliers}
        headCells={headCells}
        rows={suppliers.find(s => s.id === parseInt(formData.id))?.products || []}
        contentHeader={''}
      />
    </Layout>
  );
}