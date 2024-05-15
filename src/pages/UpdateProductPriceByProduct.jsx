import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Input,
  FormControl,
  InputLabel,
  LinearProgress,
  Typography,
} from "@mui/material";
import { CLIENT_URL, USER_URL, SUPPLIER_URL } from "../utils/urls";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { useSuppliers } from "../hooks/useSuppliers";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/Layout";

import { DataGrid } from "../components/DataGrid";
import { useNavigate } from "react-router-dom";

export function UpdateProductPriceByProduct() {

  const { auth } = useContext(AuthContext);

  const navigate = useNavigate()

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
    <Layout title="Actualizar Precio Producto">
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

        {loadingClients || loadingUsers ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
          <form onChange={handleChange} onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "start",
                gap: 1,
              }}
            >
              {/* suppliers select */}
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
                  sx={{
                    width: "100%",
                  }}
                  // value={suppliers}
                  onChange={handleChange}
                  label="Proveedor"
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
              {/* stock select */}
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
                  <InputLabel
                    className="font-semibold text-gray-400 text-sm"
                    id="demo-simple-select-standard-label"
                  >
                    Porcentaje*
                  </InputLabel>
                  <Input className="w-full"
                    placeholder="0,00"
                  />
                </FormControl>
                <Button variant="contained" size="small">
                  Calcular
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Box>
      {/* button section */}
      <Box className="w-[50%] flex items-center justify-start gap-2  mb-4">
        <Button variant="contained" size="medium">
          imprimir
        </Button>
        <Button variant="outlined" size="medium">
          Volver
        </Button>
      </Box>

      {/* Datagrid */}
      <DataGrid
        headCells={headCells}
        rows={suppliers}
        setOpen={setOpen}
        setData={setFormData}
        contentHeader={''}
      >

      </DataGrid>
    </Layout>
  );
}
