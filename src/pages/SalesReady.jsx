import { useContext, useEffect } from "react";
import { Box, Button, FormControl, Input, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useSuppliers } from "../hooks/useSuppliers";
import { useNavigate } from "react-router-dom";

import { Layout } from "../components/Layout";
import { ModalComponent } from "../components/ModalComponent";
import { DataGridWithBackendPagination } from "../components/DataGridWithBackendPagination";


export function SalesReady() {

  const { auth } = useContext(AuthContext)
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { loadingSuppliers, setLoadingSuppliers, setOpen, getSuppliers } = useSuppliers()
  const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
    defaultData: {
      id: '',
      name: '',
      address: '',
      city: '',
      province: '',
      email: '',
      phone: '',
      products: []
    },
    rules: {
      name: {
        required: true,
        maxLength: 55
      },
      address: {
        maxLength: 55
      },
      city: {
        maxLength: 55
      },
      province: {
        maxLength: 55
      },
      email: {
        maxLength: 55
      },
      phone: {
        maxLength: 55
      }
    }
  })

  useEffect(() => {
    if (auth?.user.role !== 'ADMINISTRADOR') navigate('/ventas')
  }, [])

  const headCells = [
    {
      id: 'sales code',
      numeric: false,
      disablePadding: true,
      label: 'Cod. Venta',
      accessor: 'sales code'
    },
    {
      id: "date",
      numeric: false,
      disablePadding: true,
      label: "Fecha",
      // sorter: (row) => format(new Date(getDeadline(row.date, row.installments)), 'dd/MM/yy'),
      // accessor: (row) => format(new Date(getDeadline(row.date, row.installments)), 'dd/MM/yy')
    },
    {
      id: 'hour',
      numeric: false,
      disablePadding: true,
      label: 'Hora',
      // sorter: (row) => format(new Date(getDeadline(row.date, row.installments)), 'dd/MM/yy'),
      // accessor: (row) => format(new Date(getDeadline(row.date, row.installments)), 'dd/MM/yy')
    },
    {
      id: 'client',
      numeric: false,
      disablePadding: true,
      label: 'Cliente',
      accessor: 'client'
    },
    {
      id: 'address',
      numeric: false,
      disablePadding: true,
      label: 'Dirección',
      accessor: 'address'
    },
    {
      id: 'phone',
      numeric: false,
      disablePadding: true,
      label: 'Teléfono',
      sorter: (row) => row.phone ?? '',
      accessor: 'phone'
    },
    {
      id: 'tip.comp',
      numeric: false,
      disablePadding: true,
      label: 'Tipo Comp.',
      accessor: 'tip.comp'
    },
    {
      id: 'already paid',
      numeric: false,
      disablePadding: true,
      label: 'Pagado',
      accessor: 'already paid'
    },
    {
      id: 'total',
      numeric: true,
      disablePadding: true,
      label: 'Total',
      accessor: 'total'
    },

  ]

  return (
    <Layout title="Ventas Pendientes Preparacion">
      <DataGridWithBackendPagination
        loading={loadingSuppliers || disabled}
        headCells={headCells}
        rows={state.suppliers.data}
        entityKey="suppliers"
        getter={getSuppliers}
        setOpen={setOpen}
        setFormData={setFormData}
      >
        <ModalComponent
          open={open === "NEW" || open === "EDIT" || open === "VIEW"}
          onClose={() => reset(setOpen)}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            {open === "NEW" && "Nuevo proveedor"}
            {open === "EDIT" && "Editar proveedor"}
            {open === "VIEW" && `Proveedor #${formData.id}`}
          </Typography>
          <form onChange={handleChange}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <FormControl>
                <InputLabel htmlFor="name">Nombre</InputLabel>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  disabled={open === "VIEW"}
                />
                {errors.name?.type === "required" && (
                  <Typography variant="caption" color="red" marginTop={1}>
                    * El nombre es requerido.
                  </Typography>
                )}
                {errors.name?.type === "maxLength" && (
                  <Typography variant="caption" color="red" marginTop={1}>
                    * El nombre es demasiado largo.
                  </Typography>
                )}
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="address">Dirección</InputLabel>
                <Input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  disabled={open === "VIEW"}
                />
                {errors.address?.type === "maxLength" && (
                  <Typography variant="caption" color="red" marginTop={1}>
                    * La dirección es demasiado larga.
                  </Typography>
                )}
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="city">Ciudad</InputLabel>
                <Input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  disabled={open === "VIEW"}
                />
                {errors.city?.type === "maxLength" && (
                  <Typography variant="caption" color="red" marginTop={1}>
                    * La ciudad es demasiado larga.
                  </Typography>
                )}
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="province">
                  Provincia / Estado
                </InputLabel>
                <Input
                  id="province"
                  type="text"
                  name="province"
                  value={formData.province}
                  disabled={open === "VIEW"}
                />
                {errors.province?.type === "maxLength" && (
                  <Typography variant="caption" color="red" marginTop={1}>
                    * La provincia es demasiado larga.
                  </Typography>
                )}
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled={open === "VIEW"}
                />
                {errors.email?.type === "maxLength" && (
                  <Typography variant="caption" color="red" marginTop={1}>
                    * El email es demasiado largo.
                  </Typography>
                )}
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="phone">Teléfono</InputLabel>
                <Input
                  id="phone"
                  type="number"
                  name="phone"
                  value={formData.phone}
                  disabled={open === "VIEW"}
                />
                {errors.phone?.type === "maxLength" && (
                  <Typography variant="caption" color="red" marginTop={1}>
                    * El teléfono es demasiado largo.
                  </Typography>
                )}
              </FormControl>
              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  justifyContent: "center",
                  margin: "0 auto",
                  marginTop: 1,
                  width: "50%",
                }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => reset(setOpen)}
                  sx={{
                    width: "50%",
                  }}
                >
                  {open === "VIEW" ? "Cerrar" : "Cancelar"}
                </Button>
                {(open === "NEW" || open === "EDIT") && (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={disabled}
                    sx={{
                      width: "50%",
                    }}
                  >
                    Guardar
                  </Button>
                )}
              </FormControl>
            </Box>
          </form>
        </ModalComponent>
        <ModalComponent open={open === "MASSIVE-EDIT"} dynamicContent>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Actualización de precios del proveedor {formData.name}
          </Typography>
          <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Producto</TableCell>
                  <TableCell align="center">Código</TableCell>
                  <TableCell align="center">Precio actual</TableCell>
                  <TableCell align="center">Precio nuevo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.products.map((p) => (
                  <TableRow
                    key={p.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell align="center">{p.code}</TableCell>
                    <TableCell align="center">{p.details}</TableCell>
                    <TableCell align="center">
                      ${p.buy_price.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {/* ${getNewPrice(p, massiveEditPercentage)} */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              justifyContent: "center",
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            <Typography variant="h6">Porcentaje</Typography>
            <Input
              type="number"
              value={massiveEditPercentage}
              disabled={formData.products.length === 0}
              onChange={(e) => setMassiveEditPercentage(e.target.value)}
            />
            <Typography variant="h6">%</Typography>
          </Box> */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              justifyContent: "center",
              width: "60%",
              margin: "0 auto",
            }}
          >
            <Button
              type="button"
              variant="outlined"
              sx={{ width: "50%" }}
              onClick={() => {
                reset(setOpen);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ width: "50%" }}
              disabled={formData.products.length === 0}
            >
              Guardar
            </Button>
          </Box>
        </ModalComponent>
      </DataGridWithBackendPagination>
    </Layout>
  );
}