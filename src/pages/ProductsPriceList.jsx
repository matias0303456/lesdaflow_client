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
import { CLIENT_URL, USER_URL } from "../utils/urls";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/Layout";

import { DataGrid } from "../components/DataGrid";


export function ProductsPriceList() {
  const { auth } = useContext(AuthContext);
  const { setMessage, setOpenMessage, setSeverity } =
    useContext(MessageContext);
  // clients import
  const { get, post, put } = useApi(CLIENT_URL);
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

  const [open, setOpen] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (auth?.user.role.name !== "ADMINISTRADOR") navigate("/productos");
  }, []);

  useEffect(() => {
    (async () => {
      const { status, data } = await getUsers();
      if (status === 200) {
        setUsers(data);
        setLoadingUsers(false);
      }
    })();
  }, []);

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

  const headCells = [
    {
        id: 'cod',
        numeric: false,
        disablePadding: true,
        label: 'Cod.',
        accessor: 'cod',
    },
    {
        id: 'product',
        numeric: false,
        disablePadding: true,
        label: 'Producto',
        accessor: 'product'
    },
    {
        id: 'sale_price',
        numeric: false,
        disablePadding: true,
        label: 'Precio Venta',
        accessor: 'sale_price'
    },
    {
        id: 'stock',
        numeric: false,
        disablePadding: true,
        label: 'Stock',
        accessor: 'stock'
    },
]

  return (
    <Layout title="Lista de Precios">
    {/* upper section */}
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
          Productos
        </Typography>

        {loadingClients || loadingUsers ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
          <form onChange={handleChange} onSubmit={handleSubmit}>

             <Box 
        sx={{ display: "flex", alignItems: "center", justifyContent: "start", gap: 1 }}>
        
                  {/* product cod */}
            <FormControl variant="standard" sx={{
                    width: "20%",
                    color: "#59656b",
                    display: "flex",                    alignItems: "start",
                    justifyContent: "center",
                    marginTop: "2rem"
                }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Cód.
                </InputLabel>
               <Input/>
              </FormControl>
                {/* product name */}
              <FormControl variant="standard" sx={{
                    width: "100%",
                    color: "#59656b",
                    display: "flex",                    alignItems: "start",
                    justifyContent: "center",
                    marginTop: "2rem"
                }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Producto
                </InputLabel>
               <Input
               sx={{
                width: "100%",
               }}/>
              </FormControl>
            </Box>

          </form>
        )}
      </Box>

      {/* down section */}
      <Box className="w-[100%] px-2 py-4 bg-white rounded-md">
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
          Precios
        </Typography>

        {loadingClients || loadingUsers ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
         <Box className="w-[50%]">
          <DataGrid
             headCells={headCells}
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
                
                 {/* user filter implementation */}
                 {/* <UserFilter users={users} setUsers={setUsers} /> */}
                 {/* by search box approach  */}
                 
               </Box>
             }
          >

          </DataGrid>
          <Button variant="outlined" size="medium" color="info">
            Salir
          </Button>
         </Box>
        )}
      </Box>
    </Layout>
  );
}
