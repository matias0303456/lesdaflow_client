import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useSales } from "../hooks/useSales";

import { Layout } from "../components/Layout";
import { DataGridWithBackendPagination } from "../components/DataGridWithBackendPagination";

export function CurrentAccount() {

  const { auth } = useContext(AuthContext)
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { loadingSales, setOpen, getSales } = useSales()
  const { setFormData } = useForm({
    defaultData: {}
  })

  useEffect(() => {
    if (auth?.user.role !== 'ADMINISTRADOR') navigate('/productos')
  }, [])

  const headCells = [
    {
      id: "id",
      numeric: false,
      disablePadding: true,
      label: "Cod. Venta",
      accessor: "id",
    },
    {
      id: "client",
      numeric: false,
      disablePadding: true,
      label: "Cliente",
      accessor: (row) => `${row.client.first_name} ${row.client.last_name}`
    },
    {
      id: "work_place",
      numeric: false,
      disablePadding: true,
      label: "Nombre Comercio",
      accessor: (row) => row.client.work_place,
    },
    {
      id: "date",
      numeric: false,
      disablePadding: true,
      label: "Fecha",
      accessor: (row) => format(new Date(row.date), 'dd/MM/yy')
    },
    {
      id: "expiration",
      numeric: false,
      disablePadding: true,
      label: "Vencimiento",
      accessor: (row) => 'rtyrty',
    },
    {
      id: "seller",
      numeric: false,
      disablePadding: true,
      label: "Vendedor",
      accessor: (row) => `${row.client.user.first_name} ${row.client.user.last_name}`,
    },
    {
      id: "amount",
      numeric: true,
      disablePadding: true,
      label: "Importe",
      accessor: (row) => 'rtyrty'
    },
    {
      id: "money_balance",
      numeric: true,
      disablePadding: true,
      label: "Saldo",
      accessor: (row) => 'rtyrty'
    },
    {
      id: "status",
      numeric: false,
      disablePadding: true,
      label: "Estado",
      accessor: (row) => 'rtyrty'
    },
  ];

  return (
    <Layout title="Cuentas Corrientes">
      <DataGridWithBackendPagination
        loading={loadingSales}
        headCells={headCells}
        rows={state.sales.data}
        entityKey="sales"
        getter={getSales}
        setOpen={setOpen}
        setFormData={setFormData}
        showDeleteAction
        showViewAction
        contentHeader={
          <Box>
            <Button variant="outlined" color="success">
              Excel
            </Button>
          </Box>
        }
      />
    </Layout>
  );
}
