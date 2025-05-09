import { useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, LinearProgress } from "@mui/material";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { FiltersContext } from "../providers/FiltersProvider";
import { useForm } from "../hooks/useForm";
import { useSales } from "../hooks/useSales";
import { useUsers } from "../hooks/useUsers";

import { Layout } from "../components/common/Layout";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { SaleFilter } from '../components/filters/SaleFilter'

import { getAccountStatus, getDeadline, getSaleDifference, getSaleTotal } from "../utils/helpers";
import { REPORT_URL } from "../utils/urls";

export function CurrentAccount() {

  const { auth } = useContext(AuthContext)
  const { state: dataState } = useContext(DataContext)
  const { state: filtersState } = useContext(FiltersContext)

  const navigate = useNavigate()

  const { getUsers } = useUsers()
  const { loadingSales, setOpen, getSales, pendingFilter, setPendingFilter } = useSales()
  const { setFormData } = useForm({
    defaultData: {}
  })

  useEffect(() => {
    if (auth?.user.role !== 'ADMINISTRADOR' && auth?.user.role !== 'VENDEDOR') {
      navigate('/prep-ventas')
    } else {
      getUsers()
    }
  }, [])

  useEffect(() => {
    const { page, offset, filters } = filtersState['sales']
    const { client, work_place, id, user, date, type } = filters
    const dateIsNotString = typeof date !== 'string'
    getSales(`?page=${page}&offset=${offset}&pending=true&client=${client}&work_place=${work_place}&id=${id}&user=${user}&date=${dateIsNotString ? new Date(date).toISOString() : ''}&type=${type}`)
  }, [filtersState['sales']])

  const headCells = useMemo(() => [
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
      accessor: (row) => format(new Date(row.date), 'dd/MM/yy HH:mm')
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
    }
  ], [dataState.sales.data])

  return (
    <Layout title="Cuentas Corrientes">
      {loadingSales ?
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box> :
        <DataGridWithBackendPagination
          headCells={headCells}
          rows={dataState.sales.data}
          entityKey="sales"
          setOpen={setOpen}
          setFormData={setFormData}
          showPDFAction={`${REPORT_URL}/accounts-pdf?token=${auth?.token}&id=`}
          contentHeader={
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <Button variant="outlined" color='error' sx={{ width: '10%' }} onClick={() => {
                const { filters } = filtersState['sales']
                const { client, work_place, id, type } = filters
                window.open(`${REPORT_URL}/accounts-pdf?token=${auth?.token}&client=${client}&work_place=${work_place}&id=${id}&type=${type}&pending=${pendingFilter}`, '_blank')
              }}>
                PDF
              </Button>
              <SaleFilter
                showWorkPlace
                showPending
                showSeller={auth?.user.role === 'ADMINISTRADOR'}
                pendingFilter={pendingFilter}
                setPendingFilter={setPendingFilter}
                width={{
                  main: { xs: '100%', md: '90%' },
                  client: { xs: '100%', md: '15%' },
                  id: { xs: '100%', md: '15%' },
                  btn: { xs: '100%', md: '10%' },
                  work_place: { xs: '100%', md: '15%' },
                  seller: { xs: '100%', md: '15%' }
                }}
              />
            </Box>
          }
        />
      }
    </Layout>
  );
}
