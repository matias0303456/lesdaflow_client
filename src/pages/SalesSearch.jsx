import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';
import { Box, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useUsers } from "../hooks/useUsers";

import { Layout } from "../components/common/Layout";
import { DataGridWithFrontendPagination } from "../components/datagrid/DataGridWithFrontendPagination";
import { useSales } from "../hooks/useSales";

export function SalesSearch() {

  const { auth } = useContext(AuthContext);
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { loadingUsers, getUsers } = useUsers()
  const { getSales } = useSales()
  const { formData, handleChange } = useForm({
    defaultData: { from: new Date(Date.now()), to: new Date(Date.now()), code: '', user: '' }
  });

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/ventas");
  }, []);

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    if (formData.code.length > 0 || formData.user.toString().length > 0) {
      getSales(`?code=${formData.code}&user=${formData.user}`)
    }
  }, [formData])

  const headCells = [
    {
      id: "id",
      numeric: true,
      disablePadding: false,
      label: "Cod. Venta",
      accessor: "id",
    },
    {
      id: "date",
      numeric: false,
      disablePadding: true,
      label: "Fecha",
      accessor: (row) => format(new Date(row.date), 'dd/MM/yy')
    },
    {
      id: 'hour',
      numeric: false,
      disablePadding: true,
      label: 'Hora',
      accessor: (row) => format(new Date(row.date), 'hh:mm')
    },
    {
      id: "type",
      numeric: false,
      disablePadding: true,
      label: "Tipo de Comprobante",
      accessor: "type"
    },
  ];

  return (
    <Layout title="Búsqueda de Ventas">
      <Box className="w-[100%]" sx={{ backgroundColor: '#fff' }}>
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
        <form className="gridContainer mb-1">
          <Box sx={{ display: "flex", alignItems: "end", justifyContent: "start", gap: 2, padding: 2 }}>
            <FormControl variant="standard" sx={{ width: "16.5%", color: "#59656b" }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha Inicio"
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
            <FormControl variant="standard" sx={{ width: "16.5%", color: "#59656b" }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha Fin"
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
              className="focus:text-black"
              sx={{
                width: "16.5%",
                color: "#59656b",
                display: "flex",
                alignItems: "start",
                justifyContent: "center"
              }}
            >
              <InputLabel className="focus:text-black">Cod. Venta</InputLabel>
              <Input value={formData.code} id="code" name="code" onChange={handleChange} />
            </FormControl>
            <FormControl
              variant="standard"
              sx={{
                minWidth: "50%",
                color: "#59656b",
                display: "flex",
                alignItems: "start",
                justifyContent: "center"
              }}
            >
              <InputLabel>Vendedor</InputLabel>
              <Select
                labelId="seller-select"
                id="user"
                value={formData.user}
                label="Vendedor"
                name="user"
                onChange={handleChange}
                sx={{ width: "100%" }}
              >
                <MenuItem value="">Seleccione</MenuItem>
                {state.users.data.map((u) => (
                  <MenuItem key={u.id} value={u.username}>
                    {`${u.first_name} ${u.last_name}`.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </form>
      </Box>
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
          Información de Ventas
        </Typography>
        <DataGridWithFrontendPagination
          loading={loadingUsers}
          headCells={headCells}
          rows={state.sales.data}
        />
      </Box>
    </Layout>
  );
}