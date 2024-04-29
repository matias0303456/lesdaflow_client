import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClients } from "../hooks/useClients";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";

import { DataGrid } from "../components/DataGrid";
import { Layout } from "../components/Layout";

import { CLIENT_URL } from "../utils/urls";

export function StockReplenishment() {
  const { setMessage, setOpenMessage, setSeverity } =
    useContext(MessageContext);
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

  const [open, setOpen] = useState(null);
  const { get, post, put, destroy } = useApi(CLIENT_URL);
  const { clients, setClients, loadingClients, setLoadingClients } =
    useClients();

  useEffect(() => {
    if (auth?.user.role.name !== "ADMINISTRADOR") navigate("/productos");
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
          setUsers([data, ...users]);
          setMessage("Usuario creado correctamente.");
        } else {
          setUsers([data, ...users.filter((u) => u.id !== formData.id)]);
          setMessage("Usuario editado correctamente.");
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
      {loadingClients ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <DataGrid
          headCells={headCells}
          rows={clients}
          setOpen={setOpen}
          setData={setFormData}
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
             
            </Box>
          }
        ></DataGrid>
      )}
    </Layout>
  );
}
