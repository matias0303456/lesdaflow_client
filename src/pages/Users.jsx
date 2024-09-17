import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel, LinearProgress, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "../hooks/useForm";
import { useUsers } from "../hooks/useUsers";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { DataGridWithFrontendPagination } from "../components/datagrid/DataGridWithFrontendPagination";
import { LoginForm } from "../components/common/LoginForm";

export function Users() {

  const { auth } = useContext(AuthContext)

  const { loadingUser, getUser, setOpen, handleSubmit, open, user } = useUsers()
  const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
    defaultData: {
      id: '',
      first_name: '',
      last_name: '',
      document_type: 'DNI',
      document_number: '',
      birth: new Date(Date.now()),
      cell_phone: '',
      local_phone: '',
      email: '',
      address: '',
      username: '',
      password: '',
      is_active: true
    },
    rules: {
      first_name: {
        required: true,
        maxLength: 55
      },
      last_name: {
        required: true,
        maxLength: 55
      },
      document_number: {
        maxLength: 15
      },
      local_phone: {
        maxLength: 55
      },
      cell_phone: {
        maxLength: 55
      },
      address: {
        maxLength: 55
      },
      username: {
        required: true,
        maxLength: 55
      },
      password: {
        required: true,
        minLength: 8,
        maxLength: 191
      },
      email: {
        maxLength: 55
      }
    }
  })

  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (auth) getUser()
  }, [])

  const headCells = [
    {
      id: "first_name",
      numeric: false,
      disablePadding: true,
      label: "Nombre",
      sorter: (row) => row.first_name,
      accessor: 'first_name'
    },
    {
      id: "last_name",
      numeric: false,
      disablePadding: true,
      label: "Apellido",
      sorter: (row) => row.last_name,
      accessor: 'last_name'
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
      accessor: (row) => (
        <Link target="_blank" to={`https://www.google.com/maps?q=${row.address}`}>
          <span style={{ color: '#078BCD' }}>{row.address}</span>
        </Link>
      )
    }
  ]

  return (
    <>
      {auth ?
        <Layout title="Usuarios">
          {loadingUser ?
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box> :
            <DataGridWithFrontendPagination
              headCells={headCells}
              rows={[user]}
              setFormData={setFormData}
              setOpen={setOpen}
              filter={{ page: 0, offset: 1 }}
              showEditAction
              showDeleteAction
              count={1}
              contentHeader={
                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: 'space-between' }}>
                  <Button variant="outlined" size="medium" onClick={() => {
                    reset()
                    setOpen("NEW")
                  }}>
                    Agregar
                  </Button>
                  {/* <UserFilter /> */}
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
                        <InputLabel htmlFor="first_name">Nombre *</InputLabel>
                        <Input id="first_name" type="text" name="first_name" value={formData.first_name} disabled={open === 'VIEW'} />
                        {errors.first_name?.type === 'required' &&
                          <Typography variant="caption" color="red" marginTop={1}>
                            * El nombre es requerido.
                          </Typography>
                        }
                        {errors.first_name?.type === 'maxLength' &&
                          <Typography variant="caption" color="red" marginTop={1}>
                            * El nombre es demasiado largo.
                          </Typography>
                        }
                      </FormControl>
                      <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                        <InputLabel htmlFor="last_name">Apellido *</InputLabel>
                        <Input id="last_name" type="text" name="last_name" value={formData.last_name} disabled={open === 'VIEW'} />
                        {errors.last_name?.type === 'required' &&
                          <Typography variant="caption" color="red" marginTop={1}>
                            * El nombre es requerido.
                          </Typography>
                        }
                        {errors.last_name?.type === 'maxLength' &&
                          <Typography variant="caption" color="red" marginTop={1}>
                            * El nombre es demasiado largo.
                          </Typography>
                        }
                      </FormControl>
                      <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                        <InputLabel htmlFor="username">Usuario *</InputLabel>
                        <Input id="username" type="text" name="username" value={formData.username} disabled={open === 'VIEW' || open === 'EDIT'} />
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
                          label="Contraseña *"
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
                        {errors.document_number?.type === 'maxLength' &&
                          <Typography variant="caption" color="red" marginTop={1}>
                            * El número de documento es demasiado largo.
                          </Typography>
                        }
                      </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2 }}>
                      <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                        <InputLabel htmlFor="local_phone">Teléfono</InputLabel>
                        <Input id="local_phone" type="number" name="local_phone" value={formData.local_phone} disabled={open === 'VIEW'} />
                        {errors.local_phone?.type === 'maxLength' &&
                          <Typography variant="caption" color="red" marginTop={1}>
                            * El teléfono es demasiado largo.
                          </Typography>
                        }
                      </FormControl>
                      <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                        <InputLabel htmlFor="cell_phone">Celular</InputLabel>
                        <Input id="cell_phone" type="number" name="cell_phone" value={formData.cell_phone} disabled={open === 'VIEW'} />
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
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'start', gap: { xs: 3, md: 6, xl: 9 } }}>
                      <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
                        <InputLabel htmlFor="address">Dirección</InputLabel>
                        <Input id="address" type="text" name="address" value={formData.address} disabled={open === 'VIEW'} />
                        {errors.address?.type === 'maxLength' &&
                          <Typography variant="caption" color="red" marginTop={1}>
                            * La dirección es demasiado larga.
                          </Typography>
                        }
                      </FormControl>
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
            </DataGridWithFrontendPagination>
          }
        </Layout> :
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Box>
            <Typography variant="h6" align="center" marginBottom={3}>
              Inicie sesión para usar el sistema
            </Typography>
            <LoginForm />
          </Box>
        </Box>
      }
    </>
  );
}