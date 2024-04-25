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

export function UpdateProductPriceByProduct() {
  const { auth } = useContext(AuthContext);
  const { setMessage, setOpenMessage, setSeverity } =
    useContext(MessageContext);
  // clients import
  const { get /* post, put */ } = useApi(CLIENT_URL);
  const { clients, setClients, loadingClients, setLoadingClients } =
    useClients();
  // users import
  const { get: getUsers } = useApi(USER_URL);

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

  //suppliers imports
  const { post, put, destroy, putMassive } = useApi(SUPPLIER_URL);
  const { suppliers, setSuppliers, loadingSuppliers, setLoadingSuppliers } =
    useSuppliers();

  const [open, setOpen] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (auth?.user.role.name !== "ADMINISTRADOR") navigate("/productos");
  }, []);

  useEffect(() => {
    (async () => {
      const { status, data } = await getUsers();
      if (status === 200) {
        setUsers(data);
        setLoadingUsers(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status, data } = await get();
      if (status === 200) {
        setClients(data);
        setLoadingClients(false);
      }
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      const { status, data } =
        open === "NEW" ? await post(formData) : await put(formData);
      if (status === 200) {
        if (open === "NEW") {
          setClients([data, ...clients]);
          setMessage("Cliente creado correctamente.");
        } else {
          setClients([data, ...clients.filter((c) => c.id !== formData.id)]);
          setMessage("Cliente editado correctamente.");
        }
        setSeverity("success");
        reset(setOpen);
      } else {
        setMessage(data.message);
        setSeverity("error");
        setDisabled(false);
      }
      setOpenMessage(true);
    }
  }

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
                    marginTop: "2rem",
                  }}
                >
                  <InputLabel
                    className="font-semibold text-gray-400 text-sm"
                    id="demo-simple-select-standard-label"
                  >
                    Porcentaje*
                  </InputLabel>
                  <Input className="w-full" />
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
