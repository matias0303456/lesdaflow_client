import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  FormControl,
  InputLabel,
  LinearProgress,
  Typography,
} from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useProducts } from "../hooks/useProducts";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";

import { getStock } from "../utils/helpers";
import { useForm } from "../hooks/useForm";

export function ProductsPriceList() {

  const { auth } = useContext(AuthContext);

  const navigate = useNavigate()

  const { products, loadingProducts } = useProducts()
  const { formData, handleChange } = useForm({ defaultData: { code: '', details: '' } })

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/productos");
  }, []);

  const headCells = [
    {
      id: 'code',
      numeric: false,
      disablePadding: true,
      label: 'Cod.',
      accessor: 'code',
    },
    {
      id: 'details',
      numeric: false,
      disablePadding: true,
      label: 'Producto',
      accessor: 'details'
    },
    {
      id: 'sale_price',
      numeric: false,
      disablePadding: true,
      label: 'Precio de venta',
      sorter: (row) => parseFloat((row.buy_price + ((row.buy_price / 100) * row.earn)).toFixed(2)),
      accessor: (row) => `$${(row.buy_price + ((row.buy_price / 100) * row.earn)).toFixed(2)}`
    },
    {
      id: 'stock',
      numeric: false,
      disablePadding: true,
      label: 'Stock',
      sorter: (row) => getStock(row),
      accessor: (row) => getStock(row)
    }
  ]

  return (
    <Layout title="Lista de Precios">
      {loadingProducts ?
        <Box sx={{ width: "100%" }}><LinearProgress /></Box> :
        <>
          <Box className="w-[100%] mb-3 px-2 py-4 bg-white rounded-md">
            <Typography
              variant="h6"
              sx={{
                width: "100%",
                fontSize: "14px",
                color: "white",
                paddingX: "10px",
                paddingY: "5px",
                backgroundColor: "#078BCD",
                borderRadius: "2px",
                fontWeight: "bold",
              }}
            >
              Productos
            </Typography>
            <form onChange={handleChange}>
              <Box
                sx={{ display: "flex", alignItems: "center", justifyContent: "start", gap: 1 }}>
                <FormControl variant="standard" sx={{
                  width: "20%",
                  color: "#59656b",
                  display: "flex", alignItems: "start",
                  justifyContent: "center",
                  marginTop: "2rem"
                }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Cód.
                  </InputLabel>
                  <Input name="code" />
                </FormControl>
                <FormControl variant="standard" sx={{
                  width: "100%",
                  color: "#59656b",
                  display: "flex", alignItems: "start",
                  justifyContent: "center",
                  marginTop: "2rem"
                }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Producto
                  </InputLabel>
                  <Input
                    sx={{ width: "100%" }} name="details" />
                </FormControl>
              </Box>
            </form>
          </Box>
          <Box className="w-[100%] px-2 py-4 bg-white rounded-md">
            <Typography
              variant="h6"
              sx={{
                width: "100%",
                fontSize: "14px",
                color: "white",
                paddingX: "10px",
                paddingY: "5px",
                backgroundColor: "#078BCD",
                borderRadius: "2px",
                fontWeight: "bold",
              }}
            >
              Precios
            </Typography>
            <DataGrid
              headCells={headCells}
              rows={products.filter(p => (formData.code.length === 0 || p.code.includes(formData.code)) &&
                (formData.details.length === 0 || p.details.includes(formData.details)))}
            />
            <Button variant="outlined" size="medium" color="info" onClick={() => navigate('/productos')}>
              Salir
            </Button>
          </Box>
        </>
      }
    </Layout>
  );
}