import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  LinearProgress,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Checkbox,
} from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";

import { DataGrid } from "../components/DataGrid";
import { Layout } from "../components/Layout";
import { ModalComponent } from "../components/ModalComponent";
// import { UserFilter } from "../components/filters/UserFilter";

import { ROLE_URL /* USER_URL */ } from "../utils/urls";

export function Role() {
  const { setMessage, setOpenMessage, setSeverity } =
    useContext(MessageContext);
  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();

  // const { get: getUsers, post, put, changeVendorPwd, destroy } = useApi(USER_URL)
  const { get: getRoles } = useApi(ROLE_URL);
  const {
    formData,
    setFormData,
    handleChange,
    disabled,
    setDisabled,
    validate,
    reset,
    errors,
  } = useForm({
    defaultData: {
      name: "",
      description: "",
      isAdmin: false,
    },
    rules: {
      name: {
        required: true,
        maxLength: 55,
      },
      description: {
        required: true,
      },
      isAdmin: {
        required: true,
      },
    },
  });

  const [loadingRoles, setLoadingRoles] = useState(true);

  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (auth?.user.role.name !== "ADMINISTRADOR") navigate("/productos");
  }, []);

  useEffect(() => {
    (async () => {
      const { status, data } = await getRoles();
      if (status === 200) {
        setRoles(data);
        setLoadingRoles(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (open === "DELETE") {
      handleDelete()
      setOpen(null);
    }
  }, [open])
  

  async function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      const { status, data } =
        open === "NEW" ? await post(formData) : await put(formData);
      if (status === 200) {
        if (open === "NEW") {
          setUsers([data, ...users]);
          setMessage("Usuario creado correctamente.");
        } else {
          setUsers([data, ...users.filter((u) => u.id !== formData.id)]);
          setMessage("Usuario editado correctamente.");
        }
        setSeverity("success");
        reset(setOpen);
      } else {
        setMessage(data.message);
        setSeverity("error");
        setDisabled(false);
      }
      setOpenMessage(true);
    }
  }

  async function handleDelete(formData) {
    const result = await Promise.all(elements.map((e) => destroy(e)));
    if (result.every((r) => r.status === 200)) {
      const ids = result.map((r) => r.data.id);
      setMessage(
        `${
          result.length === 1 ? "Usuario eliminado" : "Usuarios eliminados"
        } correctamente.`
      );
      setSeverity("success");
    } else {
      if (result.some((r) => r.status === 300)) {
        setMessage("Existen usuarios con datos asociados.");
      } else {
        setMessage("Ocurrió un error. Actualice la página.");
      }
      setSeverity("error");
    }
    setOpenMessage(true);
    setOpen(null);
  }

  const headCells = [
    {
      id: "role",
      numeric: false,
      disablePadding: true,
      label: "Rol",
      accessor: "name",
    },
    {
      id: "description",
      numeric: false,
      disablePadding: true,
      label: "Descripción",
      accessor: "name",
    },
  ];

  return (
    <Layout title="Role">
      {loadingRoles ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <DataGrid
          headCells={headCells}
          rows={roles}
          setOpen={setOpen}
          setData={setFormData}
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
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => setOpen("NEW")}
                >
                  Agregar
                </Button>
                <Button variant="outlined" size="medium" color="success">
                  Excel
                </Button>
                <Button variant="outlined" size="medium" color="error">
                  Pdf
                </Button>
              </Box>
              {/* user filter implementation */}
              {/* <UserFilter users={users} setUsers={setUsers} /> */}
              {/* by search box approach  */}
            </Box>
          }
        >
          {/* edit modal */}
          <ModalComponent
            open={open === "NEW" || open === "EDIT" || open === "VIEW"}
            onClose={() => reset(setOpen)}
          >
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
                marginBottom: "1.5rem",
              }}
            >
              {open === "EDIT" && "Información General"}
              {open === "VIEW" && `Usuario ${formData.username}`}
            </Typography>

            <form onChange={handleChange} onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="role-select">Rol</InputLabel>
                  <Select
                    labelId="role-select"
                    id="role_id"
                    value={formData.name}
                    label="Rol"
                    name="name"
                    onChange={handleChange}
                    disabled={open === "VIEW"}
                  >
                    {roles.map((r) => (
                      <MenuItem key={r.id} value={r.name}>
                        {r.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel htmlFor="role">Descripcion</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    value={formData.description}
                    label="Descripcion"
                    onChange={handleChange}
                    disabled={open === "VIEW"}
                  >
                    {roles.map((r) => (
                      <MenuItem key={r.id} value={r.name}>
                        {r.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* is Admin Checkbox */}
                <Box
                  sx={{
                    width: "50%",
                    display: "flex",
                    alignItems: "start",
                    justifyItems: "start",
                    flexDirection: "column",
                  }}
                >
                  <label>Es Administrador</label>
                  <Checkbox
                    checked={formData.isAdmin}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Box>

                {/* Button section */}
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    justifyContent: "start",
                    marginTop: 1,
                    width: "50%",
                  }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => reset(setOpen)}
                    sx={{
                      width: "25%",
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
                        width: "25%",
                      }}
                    >
                      Confirmar
                    </Button>
                  )}
                </FormControl>
              </Box>
            </form>
          </ModalComponent>
        </DataGrid>
      )}
    </Layout>
  );
}
