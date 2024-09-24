/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, LinearProgress, Tab, Tabs, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "../hooks/useForm";
import { useUsers } from "../hooks/useUsers";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { DataGridWithFrontendPagination } from "../components/datagrid/DataGridWithFrontendPagination";
import { LoginForm } from "../components/common/LoginForm";
import { UsersABM } from "../components/users/UsersABM";
import { Settings } from "../components/users/Settings";
import { CustomTabPanel } from "../components/common/CustomTabsPanel";

import { a11yProps } from "../utils/helpers";

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
  const [valueTab, setValueTab] = useState(0)

  useEffect(() => {
    if (auth) getUser()
  }, [])

  const handleChangeTab = (_, newValueTab) => setValueTab(newValueTab)

  const handleClose = () => {
    setValueTab(0)
    reset(setOpen)
  }

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
            <Box sx={{ width: '100%', m: 1 }}>
              <LinearProgress />
            </Box> :
            <Box sx={{ m: 1 }}>
              <DataGridWithFrontendPagination
                headCells={headCells}
                rows={[user]}
                setData={setFormData}
                setOpen={setOpen}
                filter={{ page: 0, offset: 1 }}
                showEditAction
                showDeleteAction
                showViewAction
                count={1}
                contentHeader={
                  <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: 'start' }}>
                    <Button variant="outlined" size="medium" onClick={() => setOpen("NEW")}>
                      Agregar
                    </Button>
                  </Box>
                }
              >
                <ModalComponent
                  open={open === "NEW" || open === "EDIT" || open === "VIEW"}
                  onClose={handleClose}
                >
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={valueTab} onChange={handleChangeTab} aria-label="basic tabs example">
                      <Tab
                        label={open === 'NEW' ? 'Nuevo usuario' : open === 'EDIT' ? 'Editar usuario' : `Usuario ${formData.username}`}
                        {...a11yProps(0)}
                      />
                      <Tab label="Configuración" {...a11yProps(1)} disabled={open === "VIEW"} />
                    </Tabs>
                  </Box>
                  <CustomTabPanel value={valueTab} index={0}>
                    <UsersABM
                      formData={formData}
                      handleChange={handleChange}
                      handleSubmit={handleSubmit}
                      validate={validate}
                      reset={reset}
                      errors={errors}
                      open={open}
                      setOpen={setOpen}
                      disabled={disabled}
                      setDisabled={setDisabled}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                  </CustomTabPanel>
                  <CustomTabPanel value={valueTab} index={1}>
                    <Settings
                      defaultData={formData.settings}
                      user={formData}
                      setUser={setFormData}
                      setValueTab={setValueTab}
                    />
                  </CustomTabPanel>
                </ModalComponent>
                <ModalComponent open={open === 'DELETE'} onClose={handleClose} reduceWidth={900}>
                  <Typography variant="h6" marginBottom={1} textAlign="center">
                    ¿Darse de baja del sistema?
                  </Typography>
                  <Typography variant="body1" marginBottom={2} textAlign="center">
                    No debe tener clientes ni préstamos asociados.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button type="button" variant="outlined" onClick={handleClose} sx={{ width: '35%' }}>
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      disabled={disabled}
                      sx={{ width: '35%', color: '#FFF' }}
                      onClick={() => console.log(formData)}
                    >
                      Confirmar
                    </Button>
                  </Box>
                </ModalComponent>
              </DataGridWithFrontendPagination>
            </Box>
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