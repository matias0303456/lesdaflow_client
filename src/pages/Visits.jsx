import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  LinearProgress,
  Typography,
} from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ClientFilter } from "../components/filters/ClientFilter";

import { CLIENT_URL } from "../utils/urls";

export function Visits() {
  const { auth } = useContext(AuthContext);
  const { setMessage, setOpenMessage, setSeverity } =
    useContext(MessageContext);

  const { get, post, put, destroy } = useApi(CLIENT_URL);
  const { clients, setClients, loadingClients, setLoadingClients } =
    useClients();
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

  async function handleDelete(elements) {
    setLoadingClients(true);
    const result = await Promise.all(elements.map((e) => destroy(e)));
    if (result.every((r) => r.status === 200)) {
      const ids = result.map((r) => r.data.id);
      setClients([...clients.filter((c) => !ids.includes(c.id))]);
      setMessage(
        `${
          result.length === 1 ? "Cliente eliminado" : "Clientes eliminados"
        } correctamente.`
      );
      setSeverity("success");
    } else {
      if (result.some((r) => r.status === 300)) {
        setMessage("Existen clientes con datos asociados.");
      } else {
        setMessage("Ocurrió un error. Actualice la página.");
      }
      setSeverity("error");
    }
    setOpenMessage(true);
    setLoadingClients(false);
    setOpen(null);
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
      id: "hour",
      numeric: false,
      disablePadding: true,
      label: "Hora",
      accessor: "hour",
    },
    {
      id: "client",
      numeric: false,
      disablePadding: true,
      label: "Cliente",
      accessor: "client",
    },
    {
      id: "about",
      numeric: false,
      disablePadding: true,
      label: "Tema",
      accessor: "about",
    },
    {
      id: "phone",
      numeric: false,
      disablePadding: true,
      label: "Celular",
      accessor: "phone",
    },
    {
      id: "email",
      numeric: false,
      disablePadding: true,
      label: "Email",
      sorter: (row) => row.email,
      accessor: "email",
    },
    {
      id: "address",
      numeric: false,
      disablePadding: true,
      label: "Dirección",
      accessor: "address",
    },
  ];

  return (
    <Layout title="Visitas a Clientes">
      {loadingClients || disabled ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <DataGrid
          headCells={
            auth.user.role !== "ADMINISTRADOR"
              ? headCells
              : [
                  ...headCells,
                  {
                    id: "seller",
                    numeric: false,
                    disablePadding: true,
                    label: "Vendedor",
                    sorter: (row) => row.user.username.toLowerCase(),
                    accessor: (row) => row.user.username,
                  },
                ]
          }
          rows={clients}
          setOpen={setOpen}
          setFormData={setFormData}
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
                <Button variant="outlined" onClick={() => setOpen("NEW")}>
                  Agregar
                </Button>
                <Button variant="outlined" color="success">
                  Excel
                </Button>
              </Box>
              <ClientFilter clients={clients} setClients={setClients} />
            </Box>
          }
        ></DataGrid>
      )}
    </Layout>
  );
}
