import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/common/Layout";
import { useUsers } from "../hooks/useUsers";

export function AccountsReport() {

  const { auth } = useContext(AuthContext);
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { getUsers } = useUsers()
  const { getClients } = useClients()
  const { formData, handleChange, validate, errors } = useForm({
    defaultData: { user_id: '', client_id: '' },
    rules: { user_id: { required: true }, client_id: { required: true } }
  })

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/productos");
  }, [])

  useEffect(() => {
    getClients()
    getUsers()
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    if (validate()) {
      console.log(formData)
    }
  }

  return (
    <Layout title="Reporte Cuenta Corriente">
      <Box className="w-[50%]">
        <Typography variant="h6" sx={{
          width: "100%",
          fontSize: "14px",
          color: "white",
          paddingX: "10px",
          paddingY: "5px",
          backgroundColor: "#078BCD",
          borderRadius: "2px",
          fontWeight: "bold"
        }}>
          Informacion General
        </Typography>
        <form onChange={handleChange}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, backgroundColor: '#fff', padding: 1 }}>
            <FormControl variant="standard" sx={{ margin: 1, minWidth: 120 }}>
              <InputLabel id="user_id">
                Vendedor
              </InputLabel>
              <Select
                labelId="seller-select"
                id="user_id"
                value={formData.user_id}
                label="Vendedor"
                name="user_id"
                onChange={handleChange}
              >
                {state.users.data.length > 0 ? (
                  state.users.data.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {`${u.first_name} ${u.last_name}`.toUpperCase()}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>No se encontraron resultados</MenuItem>
                )}
              </Select>
              {errors.user_id?.type === 'required' &&
                <Typography variant="caption" color="red" marginTop={1}>
                  * El vendedor es requerido.
                </Typography>
              }
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="client_id">
                Cliente
              </InputLabel>
              <Select
                labelId="client-select"
                id="client_id"
                value={formData.client_id}
                label="Cliente"
                name="client_id"
                onChange={handleChange}
              >
                {state.clients.data.filter(c => c.user_id === parseInt(formData.user_id)).length > 0 ? (
                  state.clients.data.filter(c => c.user_id === parseInt(formData.user_id)).map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {`${c.first_name} ${c.last_name}`.toUpperCase()}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>No se encontraron resultados</MenuItem>
                )}
              </Select>
              {errors.client_id?.type === 'required' &&
                <Typography variant="caption" color="red" marginTop={1}>
                  * El cliente es requerido.
                </Typography>
              }
            </FormControl>
          </Box>
        </form>
        <FormControl sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          justifyContent: "start",
          marginTop: 3,
          width: "70%",
        }}>
          <Button type="button" variant="contained" onClick={handleSubmit}>
            Imprimir
          </Button>
        </FormControl>
      </Box>
    </Layout>
  )
}