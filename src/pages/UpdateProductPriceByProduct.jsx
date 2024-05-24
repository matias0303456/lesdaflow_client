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
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useProducts } from "../hooks/useProducts";

import { Layout } from "../components/Layout";
import { DataGridWithFrontendPagination } from "../components/DataGridWithFrontendPagination";

import { getProductNewSalePriceByPercentage, getProductSalePrice } from "../utils/helpers";

export function UpdateProductPriceByProduct() {

  const { auth } = useContext(AuthContext);
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { loadingProducts, massiveEdit, setMassiveEdit, handleSubmitMassive } = useProducts()
  const { reset, formData, validate, errors, handleChange } = useForm({
    defaultData: { product_id: '', percentage: 0.00 },
    rules: { product_id: { required: true }, percentage: { required: true } }
  })

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/productos");
  }, []);

  const handleAddProduct = () => {
    if (validate()) {
      setMassiveEdit([formData, ...massiveEdit])
      reset()
    }
  }

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
      accessor: (row) => `$${getProductNewSalePriceByPercentage(row, massiveEdit.find(me => me.product_id === row.id).percentage).toFixed(2)}`
    },
    {
      id: "actions",
      numeric: false,
      disablePadding: true,
      label: "",
      accessor: (row) => (
        <Tooltip
          title="Borrar"
          onClick={() => setMassiveEdit([...massiveEdit.filter(me => me.product_id !== row.id)])}
        >
          <IconButton className="rounded-full bg-black/20 opacity-50 hover:bg-[#288bcd] hover:text-white">
            <CloseIcon className="w-4 h-4" />
          </IconButton>
        </Tooltip>
      )
    },
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
          <Box sx={{
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
              sx={{ minWidth: "100%", color: "#59656b", display: "flex", alignItems: "start", justifyContent: "center" }}
            >
              <InputLabel className="font-semibold text-gray-400 text-sm">
                Producto
              </InputLabel>
              <Select
                labelId="product-select"
                id="product_id"
                value={formData.product_id}
                name="product_id"
                onChange={handleChange}
                sx={{ width: "100%" }}
                label="Producto"
                disabled={state.products.data.filter(p => !massiveEdit.map(me => me.product_id).includes(p.id)).length === 0}
              >
                {state.products.data.filter(p => !massiveEdit.map(me => me.product_id).includes(p.id)).map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.details}
                  </MenuItem>
                ))
                }
              </Select>
              {errors.product_id?.type === 'required' &&
                <Typography variant="caption" color="red" marginTop={1}>
                  * El producto es requerido.
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
                }}
              >
                <InputLabel htmlFor="percentage" className="font-semibold text-gray-400 text-sm">
                  Porcentaje
                </InputLabel>
                <Input
                  className="w-full"
                  type="number"
                  value={formData.percentage}
                  disabled={state.products.data.filter(p => !massiveEdit.map(me => me.product_id).includes(p.id)).length === 0}
                  onChange={(e) => handleChange({ target: { name: 'percentage', value: e.target.value } })}
                />
                {errors.percentage?.type === 'required' &&
                  <Typography variant="caption" color="red" marginTop={1}>
                    * El porcentaje es requerido.
                  </Typography>
                }
              </FormControl>
              <Button
                variant="contained"
                size="small"
                onClick={handleAddProduct}
                disabled={state.products.data.filter(p => !massiveEdit.map(me => me.product_id).includes(p.id)).length === 0}
              >
                Agregar
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
      <DataGridWithFrontendPagination
        loading={loadingProducts}
        headCells={headCells}
        rows={state.products.data.filter(p => massiveEdit.map(me => me.product_id).includes(p.id))}
      />
      <Box className="w-[50%] flex items-center justify-start gap-2 mt-4">
        <Button variant="outlined" size="medium" onClick={() => navigate('/productos')}>
          Volver
        </Button>
        <Button variant="outlined" size="medium" onClick={() => setMassiveEdit([])}>
          Limpiar
        </Button>
        <Button variant="contained" size="medium" disabled={massiveEdit.length === 0} onClick={handleSubmitMassive}>
          Confirmar
        </Button>
      </Box>
    </Layout>
  );
}