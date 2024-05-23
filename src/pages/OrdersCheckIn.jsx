import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  InputLabel,
  LinearProgress,
  Typography,
} from "@mui/material";
import { CLIENT_URL, USER_URL, SUPPLIER_URL } from "../utils/urls";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { useSuppliers } from "../hooks/useSuppliers"
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/Layout";

import { DataGrid } from "../components/DataGrid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";



export function OrdersCheckIn() {

  const { auth } = useContext(AuthContext);

  const navigate = useNavigate()
  const { setMessage, setOpenMessage, setSeverity } =
    useContext(MessageContext);
  // clients import
  const { get, /* post, put */ } = useApi(CLIENT_URL);
  const { clients, setClients, loadingClients, setLoadingClients } =
    useClients();
  // users import
  const { get: getUsers } = useApi(USER_URL);

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

  //suppliers imports
  const { post, put, destroy, putMassive } = useApi(SUPPLIER_URL)
  const { suppliers, setSuppliers, loadingSuppliers, setLoadingSuppliers } = useSuppliers()


  const [open, setOpen] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/productos");
  }, []);

  useEffect(() => {
    (async () => {
      const { status, data } = await getUsers();
      if (status === 200) {
        setUsers(data[0]);
        setLoadingUsers(false);
      }
    })();
  }, []);

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

      {/* product search */}
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

        {loadingClients || loadingUsers ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
          <form onChange={handleChange} onSubmit={handleSubmit}
            className="w-[50%] flex items-center justify-start"
          >

            <Box
              sx={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "start", gap: 1 }}>

              {/* search input */}
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
        )}
      </Box>

      {/* orders details */}
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

        <form onChange={handleChange} onSubmit={handleSubmit}
          className="w-[100%] flex items-center justify-start"
        >
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

      {/* seller details */}
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

        <form onChange={handleChange} onSubmit={handleSubmit}
          className="w-[100%] flex items-center justify-start"
        >
          <Box
            className="w-[50%] flex items-center justify-start mt-4 gap-2"
          >
            {/* lastname */}
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
            {/* name */}
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

      {/* provider details */}
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

        <form onChange={handleChange} onSubmit={handleSubmit}
          className="w-[100%] flex items-center justify-start"
        >
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
        <DataGrid
          loading={false}
          headCells={headCells}
          rows={clients}
          setOpen={setOpen}
          setData={setFormData}
          contentHeader={
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 2
            }}>
              {/* <SaleFilter sales={sales} setSales={setSales} /> */}
            </Box>
          }
        >

        </DataGrid>

      </Box>

      {/* down button section */}
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
