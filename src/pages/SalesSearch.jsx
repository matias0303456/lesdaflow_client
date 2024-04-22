import { useContext, useEffect, useState } from "react";
import dayjs from 'dayjs';
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CLIENT_URL, USER_URL } from "../utils/urls";
import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { useClients } from "../hooks/useClients";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";

import { useNavigate } from "react-router-dom";

export function SalesSearch() {
  const { auth } = useContext(AuthContext);
  const { setMessage, setOpenMessage, setSeverity } =
    useContext(MessageContext);
  // clients import
  const { get, post, put } = useApi(CLIENT_URL);
  const { clients, setClients, loadingClients, setLoadingClients } =
    useClients();
  // users import
  const { get: getUsers } = useApi(USER_URL);

  const navigate = useNavigate();
//    date data
const today = dayjs();
const tomorrow = dayjs().add(1, 'day');
  
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
      id: "sale code",
      numeric: false,
      disablePadding: true,
      label: "Cod. Venta",
      accessor: "sale code",
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
    id: "receipt kind",
    numeric: false,
    disablePadding: true,
    label: "Tipo de Comprobante",
    accessor: "receipt kind",
  },
  ];

  return (
    <Layout title="Búsqueda de Ventas">
      {/* sales search */}
      <Box className="w-[100%]">
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
         Búsqueda de Ventas
        </Typography>

        {loadingClients || loadingUsers ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
          <form onChange={handleChange} onSubmit={handleSubmit}
          className="gridContainer mb-5"
          >
        <Box 
        sx={{ display: "flex", alignItems: "end", justifyContent: "start", gap: 2 }}>
            <LocalizationProvider
            dateAdapter={AdapterDayjs}>
           
           {/* start date */}
            <FormControl variant="standard"
            sx={{
                width: "16.5%",
                color: "#59656b"
            }}
            >
                <InputLabel 
                id="demo-simple-select-standard-label">
                  Fecha Inicio*
                </InputLabel>
                <DatePicker
                sx={{
                    marginTop: "3rem",
                }}
                    defaultValue={today}
                    minDate={tomorrow}
                    views={['year', 'month', 'day']}
                />
            </FormControl>
           
           {/* end date */}
           <FormControl variant="standard"
            sx={{
                width: "16.5%",
                color: "#59656b"
            }}
            >
                <InputLabel 
                id="demo-simple-select-standard-label">
                  Fecha Fin*
                </InputLabel>
                <DatePicker
                sx={{
                    marginTop: "3rem"
                }}
                    defaultValue={today}
                    minDate={tomorrow}
                    views={['year', 'month', 'day']}
                />
            </FormControl>
            
            </LocalizationProvider>

               {/* sale code input */}
               <FormControl variant="standard"
               className="focus:text-black"
               sx={{
                    width: "16.5%",
                    color: "#59656b",
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "center"
                }}>
                <InputLabel 
                className="focus:text-black"
                id="demo-simple-select-standard-label">
                  Cod. Venta
                </InputLabel>
                <Input
                onFocus={disabled}
                />
              </FormControl>

                  {/* seller select */}
            <FormControl variant="standard" sx={{
                    minWidth: "50%",
                    color: "#59656b",
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "center"
                }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Vendedor
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  sx={{
                    width: "100%"
                  }}
                  // value={age}
                  onChange={handleChange}
                  label="Vendedor"
                >
                  {users.length > 0 ? (
                    users.map((c) => (
                      <MenuItem key={c.id} value={c}>
                        {`${c.first_name} ${c.last_name}`.toUpperCase()}
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

      {/* sales info */}
      <Box className="w-[100%] mt-3">
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
         Información de Ventas
        </Typography>

        {loadingClients || loadingUsers ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
          <form onChange={handleChange} onSubmit={handleSubmit}
          className="gridContainer mb-5"
          >
            <DataGrid
            headCells={headCells}
            rows={clients}
            setOpen={setOpen}
            setData={setFormData}
            contentHeader={""}
            ></DataGrid>
          </form>
        )}
      </Box>
    </Layout>
  );
}
