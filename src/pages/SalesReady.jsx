import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Checkbox, FormControlLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useSales } from "../hooks/useSales";

import { Layout } from "../components/common/Layout";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { SaleFilter } from "../components/filters/SaleFilter";
import { ModalComponent } from "../components/common/ModalComponent";

import { getSaleDifference, getSaleTotal } from "../utils/helpers";
import { REPORT_URL } from "../utils/urls";

export function SalesReady() {

  const { auth } = useContext(AuthContext)
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const {
    loadingSales,
    open,
    setOpen,
    getSales,
    saleProducts,
    setSaleProducts,
    prepareSaleProduct
  } = useSales()
  const { formData, setFormData } = useForm({
    defaultData: {
      id: '',
      client_id: '',
      discount: '',
      installments: '',
      type: 'CUENTA_CORRIENTE',
      date: new Date(Date.now())
    }
  })

  useEffect(() => {
    if (auth?.user.role !== 'CHOFER') navigate('/productos')
  }, [])

  useEffect(() => {
    if (open === 'SETTINGS') {
      setSaleProducts(formData.sale_products)
    }
  }, [formData])

  const headCells = [
    {
      id: 'id',
      numeric: false,
      disablePadding: true,
      label: 'Cod. Venta',
      accessor: 'id'
    },
    {
      id: "date",
      numeric: false,
      disablePadding: true,
      label: "Fecha",
      accessor: (row) => format(new Date(row.date), 'dd/MM/yy')
    },
    {
      id: 'hour',
      numeric: false,
      disablePadding: true,
      label: 'Hora',
      sorter: (row) => format(new Date(row.date), 'HH:mm').toString().replace(':', ''),
      accessor: (row) => format(new Date(row.date), 'HH:mm')
    },
    {
      id: 'client_name',
      numeric: false,
      disablePadding: true,
      label: 'Cliente',
      sorter: (row) => `${row.client.first_name} ${row.client.last_name}`,
      accessor: (row) => `${row.client.first_name} ${row.client.last_name}`
    },
    {
      id: 'address',
      numeric: false,
      disablePadding: true,
      label: 'Dirección',
      sorter: (row) => row.client.address,
      accessor: (row) => row.client.address
    },
    {
      id: 'phone',
      numeric: false,
      disablePadding: true,
      label: 'Teléfono',
      sorter: (row) => row.client.local_phone.toString(),
      accessor: (row) => row.client.local_phone
    },
    {
      id: 'type',
      numeric: false,
      disablePadding: true,
      label: 'Comp.',
      accessor: (row) => row.type.replaceAll('CUENTA_CORRIENTE', 'CTA CTE')
    },
    {
      id: 'paid',
      numeric: false,
      disablePadding: true,
      label: 'Pagado',
      sorter: (row) => parseFloat(getSaleDifference(row).replace('$', '')) > 0 ? 1 : 0,
      accessor: (row) => parseFloat(getSaleDifference(row).replace('$', '')) > 0 ? 'No' : 'Sí'
    },
    {
      id: 'total',
      numeric: true,
      disablePadding: true,
      label: 'Total',
      sorter: (row) => getSaleTotal(row).replace('$', ''),
      accessor: (row) => getSaleTotal(row)
    }
  ]

  return (
    <Layout title="Ventas Pendientes Preparacion">
      <DataGridWithBackendPagination
        loading={loadingSales}
        headCells={headCells}
        rows={state.sales.data}
        entityKey="sales"
        getter={getSales}
        setOpen={setOpen}
        setFormData={setFormData}
        showSettingsAction="Preparar venta"
        showPDFAction={`${REPORT_URL}/sales-pdf-or-puppeteer?token=${auth?.token}&id=`}
        contentHeader={<SaleFilter showDateAndType />}
      />
      <ModalComponent open={open === 'SETTINGS'} onClose={() => setOpen(null)} reduceWidth={800}>
        <Typography variant="h6" marginBottom={1}>
          Preparar venta
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Código</TableCell>
                <TableCell align="center">Producto</TableCell>
                <TableCell align="center">Cantidad</TableCell>
                <TableCell align="center">Preparado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {saleProducts.map(sp => (
                <TableRow key={sp.id}>
                  <TableCell align="center">{sp.product.code}</TableCell>
                  <TableCell align="center">{sp.product.details}</TableCell>
                  <TableCell align="center">{sp.amount}</TableCell>
                  <TableCell align="center">
                    <FormControlLabel
                      control={<Checkbox />}
                      checked={sp.is_prepared}
                      onChange={async e => await prepareSaleProduct(sp.id, e.target.checked)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
          <Button type="button" variant="outlined" onClick={() => setOpen(null)} sx={{ width: '40%' }}>
            Cerrar
          </Button>
        </Box>
      </ModalComponent>
    </Layout >
  );
}