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
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useSuppliers } from "../hooks/useSuppliers";

import { Layout } from "../components/common/Layout";
import { DataGridWithFrontendPagination } from "../components/datagrid/DataGridWithFrontendPagination";

import { getProductNewSalePriceByPercentage, getProductSalePrice } from "../utils/helpers";

export function UpdateProductPriceBySupplier() {

  const { auth } = useContext(AuthContext)
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { getSuppliers, loadingSuppliers, handleSubmitMassive } = useSuppliers()
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

  useEffect(() => {
    getSuppliers()
  }, [])

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
      sorter: (row) => parseFloat(getProductSalePrice(row).toFixed(2)),
      accessor: (row) => `$${getProductSalePrice(row).toFixed(2)}`
    },
    {
      id: "new_price",
      numeric: false,
      disablePadding: true,
      label: "Precio Nuevo (venta)",
      sorter: (row) => parseFloat(getProductNewSalePriceByPercentage(row, formData.percentage).toFixed(2)),
      accessor: (row) => `$${getProductNewSalePriceByPercentage(row, formData.percentage).toFixed(2)}`
    }
  ]

  return (
    <Layout title="Actualizar Precios Productos">
      <Box sx={{ width: { xs: '100%', sm: '50%' } }} className="mb-3 bg-white rounded-md">
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
              <InputLabel htmlFor="id" className="text-gray-400">
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
                {state.suppliers.data.length > 0 ? (
                  state.suppliers.data.map((supplier) => (
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
                <InputLabel htmlFor="percentage" className="text-gray-400">
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
      <DataGridWithFrontendPagination
        loading={loadingSuppliers}
        headCells={headCells}
        rows={state.suppliers.data.find(s => s.id === parseInt(formData.id))?.products || []}
        contentHeader={''}
      />
    </Layout>
  );
}