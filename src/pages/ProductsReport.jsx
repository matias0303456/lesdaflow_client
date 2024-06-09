import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Typography,
} from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useSuppliers } from "../hooks/useSuppliers"

import { Layout } from "../components/common/Layout";

import { REPORT_URL } from "../utils/urls";

export function ProductsReport() {

  const { auth } = useContext(AuthContext);
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { formData, handleChange, validate } = useForm({
    defaultData: { supplier_id: '', stock: '' },
    rules: {}
  })
  const { loadingSuppliers, getSuppliers } = useSuppliers()

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate(auth?.user.role === 'CHOFER' ? '/prep-ventas' : "/productos");
  }, [])

  useEffect(() => {
    getSuppliers()
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    if (validate()) {
      const { supplier_id, stock } = formData
      window.open(`${REPORT_URL}/products-pdf?token=${auth?.token}${supplier_id.length > 0 ? `&supplier_id=${supplier_id}` : ''}${stock.length > 0 ? `&stock=${stock}` : ''}`, '_blank')
    }
  }

  return (
    <Layout title="Reporte Productos">
      {loadingSuppliers ? <Box sx={{ width: "100%" }}><LinearProgress /></Box> :
        <>
          <Box sx={{ width: { xs: '100%', sm: '50%' }, backgroundColor: '#fff' }} className="rounded-md">
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
              Información General
            </Typography>
            <form onChange={handleChange}>
              <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "start", gap: 2, margin: 1 }}>
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
                  <InputLabel>Proveedor</InputLabel>
                  <Select
                    labelId="supplier-select"
                    id="supplier_id"
                    value={formData.supplier_id}
                    label="Proveedor"
                    name="supplier_id"
                    onChange={handleChange}
                    disabled={state.suppliers.data.length === 0}
                    sx={{ width: "100%" }}
                  >
                    <MenuItem value="">Seleccione</MenuItem>
                    {state.suppliers.data.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="standard" sx={{
                  width: "100%",
                  color: "#59656b",
                  display: "flex", alignItems: "start",
                  justifyContent: "center",
                  marginBottom: 2
                }}>
                  <InputLabel>Existencia</InputLabel>
                  <Select
                    labelId="stock-select"
                    id="stock"
                    value={formData.stock}
                    label="Existencia"
                    name="stock"
                    onChange={handleChange}
                    disabled={state.suppliers.data.length === 0}
                    sx={{ width: "100%" }}
                  >
                    <MenuItem value="">Seleccione</MenuItem>
                    <MenuItem value="CON_STOCK">CON STOCK</MenuItem>
                    <MenuItem value="SIN_STOCK">SIN STOCK</MenuItem>
                    <MenuItem value="STOCK_MINIMO">STOCK MINIMO</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </form>
          </Box>
          <Button variant="contained" size="medium" sx={{ marginTop: 1 }} onClick={handleSubmit}>
            Imprimir
          </Button>
        </>
      }
    </Layout>
  );
}