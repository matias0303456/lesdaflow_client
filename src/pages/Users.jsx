import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";

import { DataGrid } from "../components/DataGrid";
import { Layout } from "../components/Layout";
import { ModalComponent } from "../components/ModalComponent";
import { UserFilter } from "../components/filters/UserFilter";

import { USER_URL } from "../utils/urls";

export function Users() {

  const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)
  const { auth } = useContext(AuthContext)

  const navigate = useNavigate()

  const { get: getUsers, post, put, changeVendorPwd, destroy } = useApi(USER_URL)
  const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
    defaultData: {
      id: '',
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      role: 'ADMINISTRADOR'
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
      username: {
        required: true,
        maxLength: 55
      },
      email: {
        required: true,
        maxLength: 55
      },
      password: {
        required: true,
        minLength: 8,
        maxLength: 255
      }
    }
  })

  const [loadingUsers, setLoadingUsers] = useState(true)
  const [users, setUsers] = useState([])
  const [open, setOpen] = useState(null)
  const [newPwd, setNewPwd] = useState('')

  useEffect(() => {
    if (auth?.user.role !== 'ADMINISTRADOR') navigate('/productos')
  }, [])

  useEffect(() => {
    (async () => {
      const { status, data } = await getUsers()
      if (status === 200) {
        setUsers(data[0])
        setLoadingUsers(false)
      }
    })()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (validate()) {
      const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
      if (status === 200) {
        if (open === 'NEW') {
          setUsers([data, ...users])
          setMessage('Usuario creado correctamente.')
        } else {
          setUsers([data, ...users.filter(u => u.id !== formData.id)])
          setMessage('Usuario editado correctamente.')
        }
        setSeverity('success')
        reset(setOpen)
      } else {
        setMessage(data.message)
        setSeverity('error')
        setDisabled(false)
      }
      setOpenMessage(true)
    }
  }

  async function handleSubmitNewPwd(e) {
    e.preventDefault()
    setLoadingUsers(true)
    const { status, data } = await changeVendorPwd(formData.id, { password: newPwd })
    if (status === 200) {
      setSeverity('success')
      reset(setOpen)
      setNewPwd('')
    } else {
      setSeverity('error')
      setDisabled(false)
    }
    setMessage(data.message)
    setOpenMessage(true)
    setLoadingUsers(false)
  }

  async function handleDelete(elements) {
    setLoadingUsers(true)
    const result = await Promise.all(elements.map(e => destroy(e)))
    if (result.every(r => r.status === 200)) {
      const ids = result.map(r => r.data.id)
      setUsers([...users.filter(u => !ids.includes(u.id))])
      setMessage(`${result.length === 1 ? 'Usuario eliminado' : 'Usuarios eliminados'} correctamente.`)
      setSeverity('success')
    } else {
      if (result.some(r => r.status === 300)) {
        setMessage('Existen usuarios con datos asociados.')
      } else {
        setMessage('Ocurrió un error. Actualice la página.')
      }
      setSeverity('error')
    }
    setOpenMessage(true)
    setLoadingUsers(false)
    setOpen(null)
  }

  const headCells = [
    {
      id: 'first_name',
      numeric: false,
      disablePadding: true,
      label: 'Nombre',
      accessor: 'first_name',
    },
    {
      id: 'last_name',
      numeric: false,
      disablePadding: true,
      label: 'Apellido',
      accessor: 'last_name'
    },
    {
      id: 'username',
      numeric: false,
      disablePadding: true,
      label: 'Usuario',
      accessor: 'username'
    },
    {
      id: 'email',
      numeric: false,
      disablePadding: true,
      label: 'Email',
      accessor: 'email'
    },
    {
      id: 'role',
      numeric: false,
      disablePadding: true,
      label: 'Rol',
      accessor: 'role'
    },
  ]

  return (
    <Layout title="Personal">
      {loadingUsers || disabled ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <DataGrid
          headCells={headCells}
          rows={users}
          setOpen={setOpen}
          setData={setFormData}
          showEditAction
          showDeleteAction
          showViewAction
          contentHeader={
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="outlined" size="medium" onClick={() => setOpen("NEW")}>
                  Agregar
                </Button>
                <Button variant="outlined" size="medium" color="success">
                  Excel
                </Button>
                <Button variant="outlined" size="medium" color="error">
                  Pdf
                </Button>
              </Box>
              <UserFilter users={users} setUsers={setUsers} />

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
            <form onChange={handleChange} onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <FormControl>
                  <InputLabel htmlFor="first_name">Nombre</InputLabel>
                  <Input
                    id="first_name"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    disabled={open === "VIEW"}
                  />
                  {errors.first_name?.type === "required" && (
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El nombre es requerido.
                    </Typography>
                  )}
                  {errors.first_name?.type === "maxLength" && (
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El nombre es demasiado largo.
                    </Typography>
                  )}
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="last_name">Apellido</InputLabel>
                  <Input
                    id="last_name"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    disabled={open === "VIEW"}
                  />
                  {errors.last_name?.type === "required" && (
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El apellido es requerido.
                    </Typography>
                  )}
                  {errors.last_name?.type === "maxLength" && (
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El apellido es demasiado largo.
                    </Typography>
                  )}
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="username">Usuario</InputLabel>
                  <Input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    disabled={open === "VIEW"}
                  />
                  {errors.username?.type === "required" && (
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El nombre de usuario es requerido.
                    </Typography>
                  )}
                  {errors.username?.type === "maxLength" && (
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El nombre de usuario es demasiado largo.
                    </Typography>
                  )}
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled={open === "VIEW"}
                  />
                  {errors.email?.type === "required" && (
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El email es requerido.
                    </Typography>
                  )}
                  {errors.email?.type === "maxLength" && (
                    <Typography variant="caption" color="red" marginTop={1}>
                      * El email es demasiado largo.
                    </Typography>
                  )}
                </FormControl>
                {open === "NEW" && (
                  <FormControl>
                    <InputLabel htmlFor="password">Contraseña</InputLabel>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                    />
                    {errors.password?.type === "required" && (
                      <Typography variant="caption" color="red" marginTop={1}>
                        * La contraseña es requerida.
                      </Typography>
                    )}
                    {errors.password?.type === "minLength" && (
                      <Typography variant="caption" color="red" marginTop={1}>
                        * La contraseña es demasiado corta.
                      </Typography>
                    )}
                    {errors.password?.type === "maxLength" && (
                      <Typography variant="caption" color="red" marginTop={1}>
                        * La contraseña es demasiado larga.
                      </Typography>
                    )}
                  </FormControl>
                )}
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    justifyContent: "center",
                    margin: "0 auto",
                    marginTop: 1,
                    width: "50%",
                  }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => reset(setOpen)}
                    sx={{
                      width: "50%",
                    }}
                  >
                    {open === "VIEW" ? "Cerrar" : "Cancelar"}
                  </Button>
                  {(open === "NEW" || open === "EDIT") && (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={disabled}
                      sx={{
                        width: "50%",
                      }}
                    >
                      Guardar
                    </Button>
                  )}
                </FormControl>
              </Box>
            </form>
          </ModalComponent>
          <ModalComponent
            open={open === "PWD-EDIT"}
            onClose={() => {
              reset(setOpen);
              setNewPwd("");
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              {`Cambiar la contraseña del vendedor ${formData.username}`}
            </Typography>
            <FormControl>
              <InputLabel htmlFor="password">Nueva contraseña</InputLabel>
              <Input
                id="password"
                type="password"
                name="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
              />
            </FormControl>
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                justifyContent: "center",
                margin: "0 auto",
                marginTop: 2,
                width: "50%",
              }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={() => {
                  reset(setOpen);
                  setNewPwd("");
                }}
                sx={{
                  width: "50%",
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={newPwd.length < 8}
                sx={{ width: "50%" }}
                onClick={handleSubmitNewPwd}
              >
                Guardar
              </Button>
            </FormControl>
          </ModalComponent>
        </DataGrid>
      )}
    </Layout>
  );
}