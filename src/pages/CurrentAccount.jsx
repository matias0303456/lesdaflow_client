import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useSales } from "../hooks/useSales";

import { Layout } from "../components/common/Layout";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { SaleFilter } from '../components/filters/SaleFilter'

import { getAccountStatus, getDeadline, getSaleDifference, getSaleTotal } from "../utils/helpers";
import { REPORT_URL } from "../utils/urls";

export function CurrentAccount() {

  const { auth } = useContext(AuthContext)
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { loadingSales, setOpen, getSales } = useSales()
  const { setFormData } = useForm({
    defaultData: {}
  })

  useEffect(() => {
    if (auth?.user.role !== 'ADMINISTRADOR' && auth?.user.role !== 'VENDEDOR') navigate('/prep-ventas')
  }, [])

  const [pendingFilter, setPendingFilter] = useState(true)

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
      sorter: (row) => row.client.work_place,
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
      id: "deadline",
      numeric: false,
      disablePadding: true,
      label: "Vencimiento",
      sorter: (row) => getDeadline(row.date),
      accessor: (row) => getDeadline(row.date)
    },
    {
      id: "seller",
      numeric: false,
      disablePadding: true,
      label: "Vendedor",
      sorter: (row) => row.client.user.name,
      accessor: (row) => row.client.user.name
    },
    {
      id: "amount",
      numeric: true,
      disablePadding: true,
      label: "Importe",
      sorter: (row) => getSaleTotal(row),
      accessor: (row) => getSaleTotal(row)
    },
    {
      id: "difference",
      numeric: true,
      disablePadding: true,
      label: "Saldo",
      sorter: (row) => getSaleDifference(row),
      accessor: (row) => getSaleDifference(row)
    },
    {
      id: "status",
      numeric: false,
      disablePadding: true,
      label: "Estado",
      sorter: (row) => getAccountStatus(row),
      accessor: (row) => getAccountStatus(row)
    },
  ];

  return (
    <Layout title="Cuentas Corrientes">
      <DataGridWithBackendPagination
        loading={loadingSales}
        headCells={headCells}
        rows={state.sales.data}
        entityKey="sales"
        salesAdapter="CurrentAccount"
        pendingFilter={pendingFilter}
        getter={getSales}
        setOpen={setOpen}
        setFormData={setFormData}
        showPDFAction={`${REPORT_URL}/accounts-pdf?token=${auth?.token}&id=`}
        showDeleteAction
        showViewAction
        contentHeader={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button variant="outlined" color='error' sx={{ width: '10%' }} onClick={() => {
              window.open(`${REPORT_URL}/accounts-pdf?token=${auth?.token}`, '_blank')
            }}>
              PDF
            </Button>
            <SaleFilter
              showWorkPlace
              showPending
              salesAdapter="CurrentAccount"
              pendingFilter={pendingFilter}
              setPendingFilter={setPendingFilter}
              width={{ main: '90%', client: '15%', id: '15%', btn: '10%', work_place: '15%' }}
            />
          </Box>
        }
      />
    </Layout>
  );
}
