import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { CLIENT_URL, USER_URL } from "../utils/urls";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/Layout";
import { useNavigate } from "react-router-dom";

export function AccountsReport() {

  const { auth } = useContext(AuthContext);

  const navigate = useNavigate()
  const { setMessage, setOpenMessage, setSeverity } =
    useContext(MessageContext);
  // clients import
  const { get, post, put } = useApi(CLIENT_URL);
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
  const {clients, loadingClients} = useClients()

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/clientes");
  }, []);

  return (
    <Layout title="Reporte Cuenta Corriente">
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
            marginBottom: "1.5rem",
          }}
        >
          Informacion General
        </Typography>

        {loadingClients ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
          <form onChange={handleChange}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* vendor select */}
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Vendedor
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
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
              {/* client select */}
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Cliente
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  //   value={}
                  onChange={handleChange}
                  label="Cliente"
                >
                  {clients.length > 0 ? (
                    clients.map((c) => (
                      <MenuItem key={c.id} value={c}>
                        {`${c.first_name} ${c.last_name}`.toUpperCase()}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>No se encontraron resultados</MenuItem>
                  )}
                </Select>
              </FormControl>

              {/* Button section */}
              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  justifyContent: "start",
                  marginTop: 3,
                  width: "70%",
                }}
              >
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => reset(setOpen)}
                >
                  imprimir
                </Button>
              </FormControl>
            </Box>
          </form>
        )}
      </Box>
    </Layout>
  );
}
