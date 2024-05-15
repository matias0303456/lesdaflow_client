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
  LinearProgress,
  Typography
} from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "../hooks/useForm";
import { useSuppliers } from "../hooks/useSuppliers";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";

export function UpdateProductPriceBySupplier() {

  const { auth } = useContext(AuthContext);

  const navigate = useNavigate()
  const { suppliers, loadingSuppliers, setOpen } = useSuppliers()

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
    defaultData: { supplier_id: '' },
    rules: { supplier_id: { required: true } },
  });

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/productos");
  }, []);

  const headCells = [
    {
      id: "cod",
      numeric: false,
      disablePadding: true,
      label: "Cod.",
      accessor: "cod",
    },
    {
      id: "product",
      numeric: false,
      disablePadding: true,
      label: "Producto",
      accessor: "product",
    },
    {
      id: "actual_price",
      numeric: false,
      disablePadding: true,
      label: "Precio Actual",
      accessor: "actual_price",
    },
    {
      id: "new_price",
      numeric: false,
      disablePadding: true,
      label: "Precio Nuevo",
      accessor: "new_price",
    },
  ];
  return (
    <Layout title="Actualizar Precios Productos">
      <Box className="w-[50%] mb-3 px-2 py-4 bg-white rounded-md">
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
        {loadingSuppliers ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
          <form onChange={handleChange}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "start",
                gap: 1,
              }}
            >
              <FormControl
                variant="standard"
                sx={{
                  minWidth: "100%",
                  color: "#59656b",
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "center",
                  marginTop: "2rem",
                }}
              >
                <InputLabel
                  id="demo-simple-select-standard-label"
                  className="font-semibold text-gray-400 text-sm"
                >
                  Proveedor
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  sx={{ width: "100%" }}
                  onChange={handleChange}
                  label="Proveedor"
                  value={formData.supplier_id}
                >
                  {suppliers.length > 0 ? (
                    suppliers.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier}>
                        {supplier.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>No se encontraron resultados</MenuItem>
                  )}
                </Select>
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
                  <InputLabel
                    className="font-semibold text-gray-400 text-sm"
                    id="demo-simple-select-standard-label"
                  >
                    Porcentaje*
                  </InputLabel>
                  <Input className="w-full" type="number" />
                </FormControl>
                <Button variant="contained" size="small">
                  Calcular
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Box>
      <Box className="w-[50%] flex items-center justify-start gap-2  mb-4">
        <Button variant="contained" size="medium">
          Confirmar
        </Button>
        <Button variant="outlined" size="medium">
          Volver
        </Button>
      </Box>
      <DataGrid
        headCells={headCells}
        rows={suppliers}
        setOpen={setOpen}
        setData={setFormData}
        contentHeader={''}
      />
    </Layout>
  );
}
