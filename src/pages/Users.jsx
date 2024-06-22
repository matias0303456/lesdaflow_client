import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Checkbox, FormControl, FormControlLabel, IconButton, Input, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useUsers } from "../hooks/useUsers";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { UserFilter } from "../components/filters/UserFilter";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";

export function Users() {

  const { auth } = useContext(AuthContext)
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { loadingUsers, getUsers, setOpen, handleSubmit, open, handleDelete } = useUsers()
  const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
    defaultData: {
      id: '',
      name: '',
      document_type: 'DNI',
      document_number: '',
      birth: new Date(Date.now()),
      cell_phone: '',
      local_phone: '',
      email: '',
      address: '',
      username: '',
      password: '',
      role: 'VENDEDOR',
      cta_cte_commission: 0,
      contado_commission: 0,
      poxipol_commission: 0
    },
    rules: {
      name: {
        required: true,
        maxLength: 255
      },
      document_type: {
        required: true
      },
      document_number: {
        required: true,
        maxLength: 255
      },
      local_phone: {
        required: true,
        maxLength: 255
      },
      cell_phone: {
        required: true,
        maxLength: 255
      },
      address: {
        required: true,
        maxLength: 255
      },
      username: {
        required: true,
        maxLength: 255
      },
      password: {
        required: true,
        minLength: 8,
        maxLength: 255
      },
      email: {
        maxLength: 255
      },
      role: {
        required: true
      }
    }
  })

  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (auth?.user.role !== 'ADMINISTRADOR') navigate(auth?.user.role === 'CHOFER' ? '/prep-ventas' : "/productos")
  }, [])

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Nombre y apellido",
      sorter: (row) => row.name,
      accessor: 'name'
    },
    {
      id: "document_number",
      numeric: false,
      disablePadding: true,
      label: "Nro. Documento",
      sorter: (row) => row.document_number.toString(),
      accessor: "document_number",
    },
    {
      id: "cell_phone",
      numeric: false,
      disablePadding: true,
      label: "Celular",
      sorter: (row) => row.cell_phone.toString(),
      accessor: "cell_phone"
    },
    {
      id: "local_phone",
      numeric: false,
      disablePadding: true,
      label: "Teléfono",
      sorter: (row) => row.local_phone.toString(),
      accessor: "local_phone"
    },
    {
      id: "address",
      numeric: false,
      disablePadding: true,
      label: "Dirección",
      sorter: (row) => row.address,
      accessor: "address"
    },
    {
      id: "role",
      numeric: false,
      disablePadding: true,
      label: "Rol",
      sorter: (row) => row.role,
      accessor: "role"
    },
    {
      id: "is_active",
      numeric: false,
      disablePadding: true,
      label: "Alta/baja",
      sorter: (row) => row.is_active ? 1 : 0,
      accessor: (row) => (
        <Box sx={{ textAlign: 'center' }}>
          <FormControlLabel
            control={<Checkbox />}
            checked={row.is_active}
            onChange={e => { }}
          />
        </Box>
      )
    }
  ]

  return (
    <Layout title="Usuarios">
      <DataGridWithBackendPagination
        loading={loadingUsers || disabled}
        headCells={headCells}
        rows={state.users.data}
        entityKey="users"
        getter={getUsers}
        setOpen={setOpen}
        setFormData={setFormData}
        showEditAction
        showDeleteAction
        showViewAction
        contentHeader={
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: 'space-between' }}>
            <Button variant="outlined" size="medium" onClick={() => setOpen("NEW")}>
              Agregar
            </Button>
            <UserFilter />
          </Box>
        }
      >
        <ModalComponent
          open={open === "NEW" || open === "EDIT" || open === "VIEW"}
          onClose={() => reset(setOpen)}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            {open === "NEW" && "Nuevo usuario"}
            {open === "EDIT" && "Editar usuario"}
            {open === "VIEW" && `Usuario ${formData.username}`}
          </Typography>
          <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, validate, formData, reset, setDisabled)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2 }}>
                <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                  <InputLabel htmlFor="name">Nombre y apellido</InputLabel>
                  <Input id="name" type="text" name="name" value={formData.name} disabled={open === 'VIEW'} />
                  {errors.name?.type === 'required' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El nombre es requerido.
                    </Typography>
                  }
                  {errors.name?.type === 'maxLength' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El nombre es demasiado largo.
                    </Typography>
                  }
                </FormControl>
                <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                  <InputLabel htmlFor="username">Usuario</InputLabel>
                  <Input id="username" type="text" name="username" value={formData.username} disabled={open === 'VIEW'} />
                  {errors.username?.type === 'required' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El usuario es requerido.
                    </Typography>
                  }
                  {errors.username?.type === 'maxLength' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El usuario es demasiado largo.
                    </Typography>
                  }
                </FormControl>
                <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                  <TextField
                    type={showPassword ? 'text' : 'password'}
                    label="Contraseña"
                    variant="outlined"
                    id="password"
                    name="password"
                    value={formData.password}
                    disabled={open === 'VIEW'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.password?.type === 'required' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * La contraseña es requerida.
                    </Typography>
                  }
                  {errors.password?.type === "minLength" && (
                    <Typography variant="caption" color="red" marginTop={1}>
                      * La contraseña es demasiado corta.
                    </Typography>
                  )}
                  {errors.password?.type === 'maxLength' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * La contraseña es demasiado larga.
                    </Typography>
                  }
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2 }}>
                <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                      label="Fecha nacimiento"
                      value={new Date(formData.birth)}
                      disabled={open === 'VIEW'}
                      onChange={value => handleChange({
                        target: {
                          name: 'birth',
                          value: new Date(value.toISOString())
                        }
                      })}
                    />
                  </LocalizationProvider>
                  {errors.birth?.type === 'required' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * La fecha de nacimiento es requerida.
                    </Typography>
                  }
                </FormControl>
                <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                  <InputLabel id="type-select">Tipo documento</InputLabel>
                  <Select
                    labelId="type-select"
                    id="document_type"
                    value={formData.document_type}
                    label="Tipo documento"
                    name="document_type"
                    disabled={open === 'VIEW'}
                    onChange={handleChange}
                  >
                    <MenuItem value="DNI">DNI</MenuItem>
                    <MenuItem value="LE">LE</MenuItem>
                    <MenuItem value="CUIL">CUIL</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                  <InputLabel htmlFor="document_number">Nro. documento / CUIT</InputLabel>
                  <Input id="document_number" type="text" name="document_number" value={formData.document_number} disabled={open === 'VIEW'} />
                  {errors.document_number?.type === 'required' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * La número de documento es requerido.
                    </Typography>
                  }
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2 }}>
                <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                  <InputLabel htmlFor="local_phone">Teléfono</InputLabel>
                  <Input id="local_phone" type="number" name="local_phone" value={formData.local_phone} disabled={open === 'VIEW'} />
                  {errors.local_phone?.type === 'required' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El teléfono es requerido.
                    </Typography>
                  }
                  {errors.local_phone?.type === 'maxLength' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El teléfono es demasiado largo.
                    </Typography>
                  }
                </FormControl>
                <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                  <InputLabel htmlFor="cell_phone">Celular</InputLabel>
                  <Input id="cell_phone" type="number" name="cell_phone" value={formData.cell_phone} disabled={open === 'VIEW'} />
                  {errors.cell_phone?.type === 'required' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El celular es requerido.
                    </Typography>
                  }
                  {errors.cell_phone?.type === 'maxLength' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El celular es demasiado largo.
                    </Typography>
                  }
                </FormControl>
                <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <Input id="email" type="text" name="email" value={formData.email} disabled={open === 'VIEW'} />
                  {errors.email?.type === 'maxLength' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El email es demasiado largo.
                    </Typography>
                  }
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: { xs: 2, sm: 1 } }}>
                <FormControl sx={{ width: { xs: '100%', sm: '25%' } }}>
                  <InputLabel htmlFor="address">Dirección</InputLabel>
                  <Input id="address" type="text" name="address" value={formData.address} disabled={open === 'VIEW'} />
                  {errors.address?.type === 'required' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * La dirección es requerida.
                    </Typography>
                  }
                  {errors.address?.type === 'maxLength' &&
                    <Typography variant="caption" color="red" marginTop={1}>
                      * La dirección es demasiado larga.
                    </Typography>
                  }
                </FormControl>
                <FormControl sx={{ width: { xs: '100%', sm: '20%' } }}>
                  <InputLabel id="role-select">Rol</InputLabel>
                  <Select
                    labelId="role-select"
                    id="role"
                    value={formData.role}
                    label="Rol"
                    name="role"
                    disabled={open === 'VIEW'}
                    onChange={handleChange}
                  >
                    <MenuItem value="ADMINISTRADOR">ADMINISTRADOR</MenuItem>
                    <MenuItem value="VENDEDOR">VENDEDOR</MenuItem>
                    <MenuItem value="CHOFER">CHOFER</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ width: { xs: '100%', sm: '50%' }, display: 'flex', gap: 1 }}>
                  <FormControl>
                    <InputLabel htmlFor="cta_cte_commission">Com. Cta. Cte.</InputLabel>
                    <Input
                      id="cta_cte_commission"
                      type="number"
                      name="cta_cte_commission"
                      value={formData.cta_cte_commission.toString()}
                      disabled={open === 'VIEW'}
                    />
                  </FormControl>
                  <FormControl>
                    <InputLabel htmlFor="contado_commission">Com. Contado</InputLabel>
                    <Input
                      id="contado_commission"
                      type="number"
                      name="contado_commission"
                      value={formData.contado_commission.toString()}
                      disabled={open === 'VIEW'}
                    />
                  </FormControl>
                  <FormControl>
                    <InputLabel htmlFor="poxipol_commission">Com. Poxipol</InputLabel>
                    <Input
                      id="poxipol_commission"
                      type="number"
                      name="poxipol_commission"
                      value={formData.poxipol_commission.toString()}
                      disabled={open === 'VIEW'}
                    />
                  </FormControl>
                </Box>
              </Box>
            </Box>
            <FormControl sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              justifyContent: 'center',
              margin: '0 auto',
              marginTop: 3,
              width: '50%'
            }}>
              <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{
                width: '50%'
              }}>
                {open === 'VIEW' ? 'Cerrar' : 'Cancelar'}
              </Button>
              {(open === 'NEW' || open === 'EDIT') &&
                <Button type="submit" variant="contained" disabled={disabled} sx={{
                  width: '50%'
                }}>
                  Confirmar
                </Button>
              }
            </FormControl>
          </form>
        </ModalComponent>
        <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)} reduceWidth={900}>
          <Typography variant="h6" marginBottom={1} textAlign="center">
            Confirmar eliminación de usuario
          </Typography>
          <Typography variant="body1" marginBottom={2} textAlign="center">
            Los datos no podrán recuperarse
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{ width: '35%' }}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="contained"
              disabled={disabled}
              sx={{ width: '35%' }}
              onClick={() => handleDelete(formData)}
            >
              Confirmar
            </Button>
          </Box>
        </ModalComponent>
      </DataGridWithBackendPagination>
    </Layout>
  );
}