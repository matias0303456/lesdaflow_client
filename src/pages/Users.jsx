import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";

import { Layout } from "../components/Layout";
import { ModalComponent } from "../components/ModalComponent";
// import { UserFilter } from "../components/filters/UserFilter";
import { DataGridWithBackendPagination } from "../components/DataGridWithBackendPagination";

import { useUsers } from "../hooks/useUsers";

export function Users() {

  const { auth } = useContext(AuthContext)
  const { state } = useContext(DataContext)

  const navigate = useNavigate()

  const { loadingUsers, getUsers, setOpen, handleSubmit, newPwd, setNewPwd, handleSubmitNewPwd } = useUsers()
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

  useEffect(() => {
    if (auth?.user.role !== 'ADMINISTRADOR') navigate('/productos')
  }, [])

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
            {/* <UserFilter users={state.users.data} setUsers={state.users.setD} /> */}
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
              onClick={(e) => handleSubmitNewPwd(e, formData, reset, setDisabled)}
            >
              Guardar
            </Button>
          </FormControl>
        </ModalComponent>
      </DataGridWithBackendPagination>
    </Layout>
  );
}