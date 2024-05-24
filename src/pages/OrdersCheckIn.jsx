import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, FormControl, InputLabel, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/Layout";
import { DataGridWithBackendPagination } from "../components/DataGridWithBackendPagination";

export function OrdersCheckIn() {

  const { auth } = useContext(AuthContext);
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { getClients, setOpen } = useClients();
  const { setFormData, handleChange } = useForm({
    defaultData: {},
    rules: {},
  });

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/productos");
  }, []);

  const headCells = [
    {
      id: 'order',
      numeric: true,
      disablePadding: false,
      label: 'Orden',
      accessor: 'order'
    },
    {
      id: 'code',
      numeric: true,
      disablePadding: false,
      label: 'Cod.',
      accessor: 'code'
    },
    {
      id: 'product',
      numeric: false,
      disablePadding: true,
      label: 'Producto',
      accessor: 'product'
    },
    {
      id: 'current_stock',
      numeric: false,
      disablePadding: true,
      label: 'Stock Actual',
      accessor: 'current_stock'
    },
    {
      id: 'amount',
      numeric: false,
      disablePadding: true,
      label: 'Cantidad',
      accessor: 'amount'
    },
  ]


  return (
    <Layout title="Ingreso de Pedidos">
      <Box className="w-[100%] mb-3 px-2 py-4 bg-white rounded-md">
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
          Buscar Pedido
        </Typography>
        <form onChange={handleChange} className="w-[50%] flex items-center justify-start">
          <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "start", gap: 1 }}>
            <FormControl variant="standard" sx={{
              minWidth: "100%",
              color: "#59656b",
              display: "flex", alignItems: "start",
              justifyContent: "start",
              marginTop: "2rem"
            }}>
              <Box
                className="w-[100%] flex items-center justify-around gap-2"
              >
                <InputLabel id="demo-simple-select-standard-label"
                  className="w-[50%] font-semibold text-gray-400 text-sm"
                >
                  Pedidos nro:
                </InputLabel>
                <Input
                  className="w-[100%] flex items-center justify-start"
                  type="number" />
                <Button variant="contained" size="small">
                  Buscar
                </Button>
              </Box>
            </FormControl>
          </Box>
        </form>
      </Box>
      <Box className="w-[100%] mb-3 px-2 py-4 bg-white rounded-md">
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
          Datos del Pedido
        </Typography>
        <form onChange={handleChange} className="w-[100%] flex items-center justify-start">
          {/* search input */}
          <Box
            className="w-[50%] flex items-center justify-start gap-6"
          >
            <FormControl
              className="w-[50%] mt-4"
            >
              <InputLabel id="demo-simple-select-standard-label"
                className="font-semibold text-gray-400 text-sm flex items-center justify-start"
              >
                Estado
              </InputLabel>
              <Input
                className="w-[100%] flex items-center justify-start"
                type="text" />
            </FormControl>
            {/* reception date */}
            <Box className="w-[50%] flex flex-col mt-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha Recepción"
                />
              </LocalizationProvider>
            </Box>
          </Box>
        </form>
      </Box>
      <Box className="w-[100%] mb-3 px-2 py-4 bg-white rounded-md">
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
          Datos del Vendedor
        </Typography>
        <form onChange={handleChange} className="w-[100%] flex items-center justify-start">
          <Box className="w-[50%] flex items-center justify-start mt-4 gap-2">
            <FormControl className="w-[50%]">
              <InputLabel id="demo-simple-select-standard-label"
                className="font-semibold text-gray-400 text-sm flex items-center justify-start"
              >
                Apellidos
              </InputLabel>
              <Input
                className="w-[100%] flex items-center justify-start"
                type="text" />
            </FormControl>
            <FormControl className="w-[50%]">
              <InputLabel id="demo-simple-select-standard-label"
                className="font-semibold text-gray-400 text-sm flex items-center justify-start"
              >
                Nombres
              </InputLabel>
              <Input
                className="w-[100%] flex items-center justify-start"
                type="text" />
            </FormControl>
          </Box>

        </form>
      </Box>
      <Box className="w-[100%] mb-3 px-2 py-4 bg-white rounded-md">
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
          Datos del Proveedor
        </Typography>
        <form onChange={handleChange} className="w-[100%] flex items-center justify-start">
          <Box
            className="w-[50%] flex items-center justify-start mt-4 gap-2"
          >
            {/* supplier */}
            <FormControl className="w-[50%]">
              <InputLabel id="demo-simple-select-standard-label"
                className="font-semibold text-gray-400 text-sm flex items-center justify-start"
              >
                Proveedor
              </InputLabel>
              <Input
                className="w-[100%] flex items-center justify-start"
                type="text" />
            </FormControl>
            {/* supplier cod */}
            <FormControl className="w-[50%]">
              <InputLabel id="demo-simple-select-standard-label"
                className="font-semibold text-gray-400 text-sm flex items-center justify-start"
              >
                Razón Social
              </InputLabel>
              <Input
                className="w-[100%] flex items-center justify-start"
                type="text" />
            </FormControl>
          </Box>

        </form>
      </Box>

      {/* details */}
      <Box className="w-[100%] mb-3 px-2 py-4 bg-white rounded-md">
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
          Detalles
        </Typography>
        <DataGridWithBackendPagination
          loading={false}
          headCells={headCells}
          rows={state.clients.data}
          entityKey="clients"
          getter={getClients}
          setOpen={setOpen}
          setData={setFormData}
        />
      </Box>
      <Box className="w-[50%] flex items-center justify-start gap-2">
        <Button variant="contained" size="medium">
          confirmar
        </Button>
        <Button variant="outlined" size="medium">
          cancelar
        </Button>
      </Box>
    </Layout>
  );
}
