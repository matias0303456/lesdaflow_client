import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';

import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "../hooks/useForm";
import { useSellers } from "../hooks/useSellers";

import { Layout } from "../components/Layout";

export function SalesReport() {

  const { auth } = useContext(AuthContext)

  const navigate = useNavigate()

  const { formData, handleChange, validate, errors } = useForm({
    defaultData: { from: new Date(Date.now()), to: new Date(Date.now()), seller_id: '' },
    rules: { seller_id: { required: true } }
  })

  const { sellers, loadingSellers } = useSellers()

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/productos")
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    if (validate()) {
      console.log(formData)
    }
  }

  return (
    <Layout title="Reporte Ventas">
      {loadingSellers ?
        <Box sx={{ width: "100%" }}><LinearProgress /></Box> :
        <>
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
                    Vendedor
                  </InputLabel>
                  <Select
                    labelId="seller-select"
                    id="seller_id"
                    value={formData.seller_id}
                    label="Proveedor"
                    name="seller_id"
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                  >
                    {sellers.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {`${s.first_name} ${s.last_name}`.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.seller_id?.type === 'required' &&
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
        </>
      }
    </Layout>
  )
}