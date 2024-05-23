import { useContext } from "react";
import { Box, Button } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/Layout";
import { ClientFilter } from "../components/filters/ClientFilter";
import { DataGridWithFrontendPagination } from "../components/DataGridWithFrontendPagination";

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
      <DataGridWithFrontendPagination
        loading={loadingClients || disabled}
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
        rows={[]}
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
              <Button variant="outlined">
                Agregar
              </Button>
              <Button variant="outlined" color="success">
                Excel
              </Button>
            </Box>
          </Box>
        }
      />
    </Layout>
  );
}
