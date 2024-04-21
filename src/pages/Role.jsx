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

import { ROLE_URL, USER_URL } from "../utils/urls";

export function Role() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)
    const { auth } = useContext(AuthContext)

    const navigate = useNavigate()

    const { get: getUsers, post, put, changeVendorPwd, destroy } = useApi(USER_URL)
    const { get: getRoles } = useApi(ROLE_URL)
    /* const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            password: '',
            role_id: ''
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
            },
            role_id: {
                required: true
            }
        }
    }) */

    // const [loadingUsers, setLoadingUsers] = useState(true)
    const [loadingRoles, setLoadingRoles] = useState(true)
    // const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [open, setOpen] = useState(null)
    // const [newPwd, setNewPwd] = useState('')

    useEffect(() => {
        if (auth?.user.role.name !== 'ADMINISTRADOR') navigate('/productos')
    }, [])

    // useEffect(() => {
    //     (async () => {
    //         const { status, data } = await getUsers()
    //         if (status === 200) {
    //             setUsers(data)
    //             setLoadingUsers(false)
    //         }
    //     })()
    // }, [])

    useEffect(() => {
        (async () => {
            const { status, data } = await getRoles()
            if (status === 200) {
                setRoles(data)
                setLoadingRoles(false)
            }
        })()
    }, [])

    // async function handleSubmit(e) {
    //     e.preventDefault()
    //     if (validate()) {
    //         const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
    //         if (status === 200) {
    //             if (open === 'NEW') {
    //                 setUsers([data, ...users])
    //                 setMessage('Usuario creado correctamente.')
    //             } else {
    //                 setUsers([data, ...users.filter(u => u.id !== formData.id)])
    //                 setMessage('Usuario editado correctamente.')
    //             }
    //             setSeverity('success')
    //             reset(setOpen)
    //         } else {
    //             setMessage(data.message)
    //             setSeverity('error')
    //             setDisabled(false)
    //         }
    //         setOpenMessage(true)
    //     }
    // }

    // async function handleSubmitNewPwd(e) {
    //     e.preventDefault()
    //     setLoadingUsers(true)
    //     const { status, data } = await changeVendorPwd(formData.id, { password: newPwd })
    //     if (status === 200) {
    //         setSeverity('success')
    //         reset(setOpen)
    //         setNewPwd('')
    //     } else {
    //         setSeverity('error')
    //         setDisabled(false)
    //     }
    //     setMessage(data.message)
    //     setOpenMessage(true)
    //     setLoadingUsers(false)
    // }

    // async function handleDelete(elements) {
    //     setLoadingUsers(true)
    //     const result = await Promise.all(elements.map(e => destroy(e)))
    //     if (result.every(r => r.status === 200)) {
    //         const ids = result.map(r => r.data.id)
    //         setUsers([...users.filter(u => !ids.includes(u.id))])
    //         setMessage(`${result.length === 1 ? 'Usuario eliminado' : 'Usuarios eliminados'} correctamente.`)
    //         setSeverity('success')
    //     } else {
    //         if (result.some(r => r.status === 300)) {
    //             setMessage('Existen usuarios con datos asociados.')
    //         } else {
    //             setMessage('Ocurrió un error. Actualice la página.')
    //         }
    //         setSeverity('error')
    //     }
    //     setOpenMessage(true)
    //     setLoadingUsers(false)
    //     setOpen(null)
    // }

    const headCells = [
       /*  {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N°',
            accessor: 'id'
        }, */
        {
            id: 'role',
            numeric: false,
            disablePadding: true,
            label: 'Role',
            accessor: 'role',
        },
        {
            id: 'description',
            numeric: false,
            disablePadding: true,
            label: 'Descripción',
            accessor: 'description'
        },
        
    ]

    return (
      <Layout title="Role">
        { loadingRoles ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
          <DataGrid
            headCells={headCells}
            rows={roles}
            setOpen={setOpen}
            // setData={setFormData}
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
                {/* user filter implementation */}
                {/* <UserFilter users={users} setUsers={setUsers} /> */}
                {/* by search box approach  */}
                
              </Box>
            }
          >
            
          </DataGrid>
        )}
      </Layout>
    );
}