import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";

import { Layout } from "../components/Layout";

const today = dayjs();
const tomorrow = dayjs().add(1, 'day');

export function RegisterMovements() {

  const { auth } = useContext(AuthContext)
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { handleChange } = useForm({
    defaultData: {},
    rules: {},
  });

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/productos");
  }, []);

  return (
    <Layout title="Reporte Cuenta Corriente">
      <Box className="w-[50%] p-2 bg-white rounded-md">
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
        <form onChange={handleChange}>
          <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "start", flexDirection: "column", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl variant="standard" className="w-[100%]">
                <DatePicker
                  label="Fecha Desde"
                  sx={{ marginTop: "3rem" }}
                  defaultValue={today}
                  minDate={tomorrow}
                  views={['year', 'month', 'day']}
                />
              </FormControl>
              <FormControl variant="standard" sx={{ width: "100%", color: "#59656b" }}>
                <DatePicker
                  label="Fecha Hasta"
                  sx={{ marginTop: "3rem" }}
                  defaultValue={today}
                  minDate={tomorrow}
                  views={['year', 'month', 'day']}
                />
              </FormControl>
            </LocalizationProvider>
            <FormControl variant="standard" sx={{
              minWidth: "100%",
              color: "#59656b",
              display: "flex", alignItems: "start",
              justifyContent: "center",
              marginTop: "2rem"
            }}>
              <InputLabel id="demo-simple-select-standard-label">
                Caja
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                sx={{ width: "100%" }}
                onChange={handleChange}
                label="Vendedor"
              >
                {state.clients.data.length > 0 ? (
                  state.clients.data.map((client) => (
                    <MenuItem key={client.id} value={client}>
                      {`${client.first_name} ${client.last_name}`.toUpperCase()}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>No se encontraron resultados</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
        </form>
      </Box>
      <Box className="mt-3">
        <Button variant="contained" color="primary">Imprimir</Button>
      </Box>
    </Layout>
  );
}
