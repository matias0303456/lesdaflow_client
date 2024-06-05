import { useContext } from "react";
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

  const { handleChange, formData, errors, validate } = useForm({
    defaultData: {
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      user_id: auth?.user.role !== 'ADMINISTRADOR' ? auth?.user.id : '',
    },
    rules: { user_id: { required: auth?.user.role === 'ADMINISTRADOR' } }
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (validate()) {
      console.log(formData)
    }
  }

  return (
    <Layout title="Reporte de Movimientos de Caja">
      <Box sx={{ width: { xs: '100%', sm: '50%' } }} className="bg-white rounded-md">
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
              <InputLabel id="user_id">
                Caja
              </InputLabel>
              <Select
                labelId="register-select"
                id="user_id"
                value={auth?.user.role === 'ADMINISTRADOR' ? formData.user_id : auth?.user.id}
                disabled={auth?.user.role !== 'ADMINISTRADOR'}
                label="Caja"
                name="user_id"
                sx={{ width: "100%" }}
                onChange={handleChange}
              >
                {auth?.user.role === 'ADMINISTRADOR' ?
                  <>
                    <MenuItem value="">Seleccione</MenuItem>
                    {state.users.data.length > 0 ? (
                      state.users.data.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {`${u.first_name} ${u.last_name}`.toUpperCase()}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem>No se encontraron resultados</MenuItem>
                    )}
                  </> :
                  <MenuItem value={auth?.user.id}>
                    {`${auth?.user.first_name} ${auth?.user.last_name}`.toUpperCase()}
                  </MenuItem>
                }
              </Select>
              {errors.user_id?.type === 'required' &&
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
