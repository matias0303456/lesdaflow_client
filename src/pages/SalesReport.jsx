import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useUsers } from "../hooks/useUsers";

import { Layout } from "../components/common/Layout";

import { REPORT_URL } from "../utils/urls";

export function SalesReport() {

  const { auth } = useContext(AuthContext)
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { getUsers } = useUsers()
  const { formData, handleChange, validate, errors, reset } = useForm({
    defaultData: {
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      user: auth?.user.role !== 'ADMINISTRADOR' ? auth?.user.username : ''
    },
    rules: { user: { required: auth?.user.role === 'ADMINISTRADOR' } }
  })

  useEffect(() => {
    if (auth?.user.role !== 'ADMINISTRADOR' && auth?.user.role !== 'VENDEDOR') navigate('/prep-ventas')
    if (auth?.user.role === 'ADMINISTRADOR') getUsers()
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    if (validate()) {
      const { from, to, user } = formData
      window.open(`${REPORT_URL}/venta-pdf?token=${auth?.token}&from=${from.toISOString()}&to=${to.toISOString()}&user=${user}`, '_blank')
      reset()
    }
  }

  return (
    <Layout title="Reporte Ventas">
      <Box className="w-[50%]" sx={{ backgroundColor: '#fff' }}>
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
        <form>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", flexDirection: "column", gap: 2, margin: 2 }}>
            <FormControl variant="standard" sx={{ width: "100%", color: "#59656b" }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha Desde"
                  value={new Date(formData.from)}
                  onChange={value => handleChange({
                    target: {
                      name: 'from',
                      value: new Date(value.toISOString())
                    }
                  })}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl variant="standard" sx={{ width: "100%", color: "#59656b" }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha Hasta"
                  value={new Date(formData.to)}
                  onChange={value => handleChange({
                    target: {
                      name: 'to',
                      value: new Date(value.toISOString())
                    }
                  })}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl
              variant="standard"
              sx={{
                minWidth: "100%",
                color: "#59656b",
                display: "flex", alignItems: "start",
                justifyContent: "center",
                marginBottom: 3
              }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Vendedor *
              </InputLabel>
              <Select
                labelId="seller-select"
                id="user"
                value={auth?.user.role === 'ADMINISTRADOR' ? formData.user : auth?.user.id}
                disabled={auth?.user.role !== 'ADMINISTRADOR'}
                label="Vendedor"
                name="user"
                onChange={handleChange}
                sx={{ width: "100%" }}
              >
                {auth?.user.role === 'ADMINISTRADOR' ? (
                  [
                    <MenuItem value="" key="select">Seleccione</MenuItem>,
                    ...(state.users.data.filter(u => u.role !== 'CHOFER').length > 0
                      ? state.users.data.filter(u => u.role !== 'CHOFER').map((u) => (
                        <MenuItem key={u.id} value={u.username}>
                          {u.name.toUpperCase()}
                        </MenuItem>
                      ))
                      : [<MenuItem key="no-results">No se encontraron resultados</MenuItem>])
                  ]
                ) : (
                  <MenuItem value={auth?.user.id} key={auth?.user.username}>
                    {`${auth?.user.name}`.toUpperCase()}
                  </MenuItem>
                )}
              </Select>
              {errors.user?.type === 'required' &&
                <Typography variant="caption" color="red" marginTop={1}>
                  * El vendedor es requerido.
                </Typography>
              }
            </FormControl>
          </Box>
        </form>
      </Box>
      <Button type="button" variant="contained" onClick={e => handleSubmit(e)}>
        Imprimir
      </Button>
    </Layout>
  )
}