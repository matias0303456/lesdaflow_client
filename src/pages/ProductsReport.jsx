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

import { Layout } from "../components/Layout";

export function ProductsReport() {

  const { auth } = useContext(AuthContext);
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { formData, handleChange, errors, validate } = useForm({
    defaultData: { supplier_id: '', stock: '' },
    rules: { supplier_id: { required: true }, stock: { required: true } }
  })
  const { loadingSuppliers, getSuppliers } = useSuppliers()

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/productos");
  }, [])

  useEffect(() => {
    getSuppliers()
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    if (validate()) {
      console.log(formData)
    }
  }

  return (
    <Layout title="Reporte Productos">
      {loadingSuppliers ? <Box sx={{ width: "100%" }}><LinearProgress /></Box> :
        <>
          <Box className="w-[50%] bg-white rounded-md">
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
                    {state.suppliers.data.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.supplier_id?.type === 'required' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El proveedor es requerido.
                    </Typography>
                  }
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
                    <MenuItem value="CON STOCK">CON STOCK</MenuItem>
                    <MenuItem value="SIN STOCK">SIN STOCK</MenuItem>
                    <MenuItem value="STOCK MINIMO">STOCK MINIMO</MenuItem>
                  </Select>
                  {errors.stock?.type === 'required' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * La existencia es requerida
                    </Typography>
                  }
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