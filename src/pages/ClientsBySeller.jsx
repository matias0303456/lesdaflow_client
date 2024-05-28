import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useUsers } from "../hooks/useUsers";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/common/Layout";
import { DataGridWithFrontendPagination } from "../components/datagrid/DataGridWithFrontendPagination";

export function ClientsBySeller() {

  const { auth } = useContext(AuthContext);
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { loadingUsers, getUsers } = useUsers()
  const { getClients, loadingClients } = useClients()
  const { formData, handleChange } = useForm({ defaultData: { user_id: '' } });

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/productos");
  }, []);

  useEffect(() => {
    getUsers()
    getClients()
  }, [])

  const headCells = [
    {
      id: "client",
      numeric: false,
      disablePadding: true,
      label: "Cliente",
      accessor: (row) => `${row.first_name} ${row.last_name}`
    },
    {
      id: "work_place",
      numeric: false,
      disablePadding: true,
      label: "Nombre Comercio",
      accessor: "work_place"
    },
    {
      id: "address",
      numeric: false,
      disablePadding: true,
      label: "Dirección",
      accessor: "address"
    },
    {
      id: "cell_phone",
      numeric: false,
      disablePadding: true,
      label: "Celular",
      accessor: "cell_phone"
    },
    {
      id: "email",
      numeric: false,
      disablePadding: true,
      label: "Email",
      accessor: "email"
    },
  ];

  return (
    <Layout title="Clientes por Vendedor">
      <Box sx={{ width: '100%', backgroundColor: '#fff' }}>
        <Box sx={{ width: "100%", color: "white", paddingX: "10px", paddingY: "5px", backgroundColor: "#078BCD", borderRadius: "2px" }} />
        <form className="mb-2" onChange={handleChange}>
          <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "start", gap: 3 }}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
              <InputLabel id="id">Vendedor</InputLabel>
              <Select
                labelId="seller-select"
                id="user_id"
                value={formData.user_id}
                label="Vendedor"
                name="user_id"
                sx={{ width: "100%" }}
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
            </FormControl>
          </Box>
        </form>
        <DataGridWithFrontendPagination
          headCells={headCells}
          rows={state.clients.data.filter(c => c.user_id === parseInt(formData.user_id))}
          loading={loadingUsers || loadingClients}
        />
      </Box>
    </Layout>
  );
}
