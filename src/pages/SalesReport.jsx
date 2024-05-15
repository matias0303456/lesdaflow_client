import { useContext, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { CLIENT_URL, USER_URL } from "../utils/urls";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/Layout";
import dayjs from 'dayjs';
//    date data
const today = dayjs();
const tomorrow = dayjs().add(1, 'day');


export function SalesReport() {
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

  return (
    <Layout title="Reporte Ventas">
      <Box className="w-[50%]">
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
          Informacion General
        </Typography>

        {loadingClients || loadingUsers ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
          <form onChange={handleChange} onSubmit={handleSubmit}>
             <Box 
        sx={{ display: "flex", alignItems: "center", justifyContent: "start", flexDirection: "column", gap: 4, marginTop:"2rem" }}>
            <LocalizationProvider
            dateAdapter={AdapterDayjs}>
           
           {/* start date */}
            <FormControl variant="standard"
            sx={{
                width: "100%",
                color: "#59656b"
            }}
            >
                <DatePicker
               label="Fecha Inicio"
                    defaultValue={today}
                    minDate={tomorrow}
                    views={['year', 'month', 'day']}
                />
            </FormControl>
           
           {/* end date */}
           <FormControl variant="standard"
            sx={{
                width: "100%",
                color: "#59656b"
            }}
            >
                <DatePicker
               label="Fecha Fin"
                    defaultValue={today}
                    minDate={tomorrow}
                    views={['year', 'month', 'day']}
                />
            </FormControl>
            
            </LocalizationProvider>


                  {/* seller select */}
            <FormControl variant="standard" sx={{
                    minWidth: "100%",
                    color: "#59656b",
                    display: "flex",                    alignItems: "start",
                    justifyContent: "center",
                    marginTop: "2rem"
                }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Vendedor
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  sx={{
                    width: "100%",
                  }}
                  // value={age}
                  onChange={handleChange}
                  label="Vendedor"
                >
                  {users.length > 0 ? (
                    users.map((user) => (
                      <MenuItem key={user.id} value={user}>
                        {`${user.first_name} ${user.last_name}`.toUpperCase()}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>No se encontraron resultados</MenuItem>
                  )}
                </Select>
              </FormControl>
        </Box>
          </form>
        )}
      </Box>
    </Layout>
  );
}