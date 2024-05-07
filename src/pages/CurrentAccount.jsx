import { useContext, useEffect, useState } from "react";
import { Box, Button, LinearProgress } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ClientFilter } from "../components/filters/ClientFilter";

import { CLIENT_URL } from "../utils/urls";

export function CurrentAccount() {
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
        setClients(data[0]);
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
      id: "cta-cte",
      numeric: true,
      disablePadding: true,
      label: "Cuenta Corriente",
      accessor: "cta-cte",
    },
    {
      id: "cod.venta",
      numeric: true,
      disablePadding: true,
      label: "Cod.Venta",
      accessor: "cod.venta",
    },
    {
      id: "client",
      numeric: false,
      disablePadding: true,
      label: "Cliente",
      accessor: "client",
    },
    {
      id: "commerce name",
      numeric: false,
      disablePadding: true,
      label: "Nombre Comercio",
      accessor: "commerce name",
    },
    {
      id: "date",
      numeric: false,
      disablePadding: true,
      label: "Fecha",
      accessor: "date",
    },
    {
      id: "expiration",
      numeric: false,
      disablePadding: true,
      label: "Vencimiento",
      accessor: "expiration",
    },
    {
      id: "amount",
      numeric: true,
      disablePadding: true,
      label: "Importe",
      accessor: "amount",
    },
    {
      id: "money-balance",
      numeric: true,
      disablePadding: true,
      label: "Saldo",
      accessor: "money-balance",
    },
    {
      id: "status",
      numeric: false,
      disablePadding: true,
      label: "Estado",
      accessor: "status",
    },
  ];

  return (
    <Layout title="Cuentas Corrientes">
      {loadingClients || disabled ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <DataGrid
          headCells={
            auth.user.role.name !== "ADMINISTRADOR"
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
