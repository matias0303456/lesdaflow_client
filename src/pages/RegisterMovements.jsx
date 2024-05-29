import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";

import { Layout } from "../components/common/Layout";

export function RegisterMovements() {

  const { auth } = useContext(AuthContext)
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { handleChange, formData, errors, validate } = useForm({
    defaultData: { from: new Date(Date.now()), to: new Date(Date.now()), register_id: '' },
    rules: { register_id: { required: true } }
  })

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/productos");
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    if (validate()) {
      console.log(formData)
    }
  }

  return (
    <Layout title="Reporte Cuenta Corriente">
      <Box className="w-[50%] bg-white rounded-md">
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
          <Box sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            flexDirection: "column",
            gap: 3,
            padding: 2
          }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha Desde"
                value={new Date(formData.from)}
                sx={{ width: '100%' }}
                onChange={value => handleChange({
                  target: {
                    name: 'from',
                    value: new Date(value.toISOString())
                  }
                })}
              />
              <DatePicker
                label="Fecha Hasta"
                value={new Date(formData.to)}
                sx={{ width: '100%' }}
                onChange={value => handleChange({
                  target: {
                    name: 'to',
                    value: new Date(value.toISOString())
                  }
                })}
              />
            </LocalizationProvider>
            <FormControl variant="standard" sx={{
              minWidth: "100%",
              color: "#59656b",
              display: "flex", alignItems: "start",
              justifyContent: "center"
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
              {errors.register_id?.type === 'required' &&
                <Typography variant="caption" color="red" marginTop={1}>
                  * La caja es requerida.
                </Typography>
              }
            </FormControl>
          </Box>
        </form>
      </Box>
      <Box className="mt-3">
        <Button variant="contained" color="primary" type="button" onClick={handleSubmit}>Imprimir</Button>
      </Box>
    </Layout>
  );
}
