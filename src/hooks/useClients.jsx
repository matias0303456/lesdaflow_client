import { useContext, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Box, Checkbox, FormControlLabel } from "@mui/material"

import { AuthContext } from "../providers/AuthProvider"
import { DataContext } from "../providers/DataProvider"
import { MessageContext } from "../providers/MessageProvider"
import { useApi } from "./useApi"
import { useForm } from "./useForm"

import { CLIENT_URL } from "../utils/urls"

export function useClients() {

    const { state, dispatch } = useContext(DataContext)
    const { auth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, destroy } = useApi(CLIENT_URL)
    const clientFormData = useForm({
        defaultData: {
            id: '',
            first_name: '',
            last_name: '',
            document_type: '',
            document_number: '',
            birth: new Date(Date.now()),
            cell_phone: '',
            local_phone: '',
            email: '',
            address: '',
            work_place: '',
            user_id: '',
            is_blocked: false
        },
        rules: {
            first_name: {
                required: true,
                maxLength: 255
            },
            last_name: {
                required: true,
                maxLength: 255
            },
            document_number: {
                maxLength: 255
            },
            cell_phone: {
                required: true,
                maxLength: 255
            },
            local_phone: {
                maxLength: 255
            },
            address: {
                required: true,
                maxLength: 255
            },
            work_place: {
                required: true,
                maxLength: 255
            },
            email: {
                maxLength: 255
            }
        }
    })

    const [open, setOpen] = useState(null)
    const [loadingClients, setLoadingClients] = useState(true)

    async function getClients(params) {
        const { status, data } = await get(params)
        if (status === 200) {
            dispatch({
                type: 'CLIENTS',
                payload: { ...state.clients, data: data[0], count: data[1] }
            })
            setLoadingClients(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function handleSubmit(e, validate, formData, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    dispatch({ type: 'CLIENTS', payload: { ...state.clients, data: [data, ...state.clients.data] } })
                    setMessage('Cliente creado correctamente.')
                } else {
                    dispatch({
                        type: 'CLIENTS',
                        payload: {
                            ...state.clients,
                            data: [
                                data,
                                ...state.clients.data.filter(c => c.id !== formData.id)
                            ]
                        }
                    })
                    setMessage('Cliente editado correctamente.')
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

    async function handleDelete(formData) {
        setLoadingClients(true)
        const { status, data } = await destroy(formData)
        if (status === 200) {
            dispatch({
                type: 'CLIENTS',
                payload: {
                    ...state.clients,
                    data: [...state.clients.data.filter(c => c.id !== data.id)]
                }
            })
            setMessage('Cliente eliminado correctamente.')
            setSeverity('success')
        } else {
            if (status === 300) {
                setMessage('El cliente tiene datos asociados.')
            } else {
                setMessage('Ocurrió un error. Actualice la página.')
            }
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingClients(false)
        setOpen(null)
    }

    async function toggleBlocked(formData) {
        const { status, data } = await put(formData)
        if (status === 200) {
            dispatch({
                type: 'CLIENTS',
                payload: {
                    ...state.clients,
                    data: [
                        data,
                        ...state.clients.data.filter(c => c.id !== formData.id)
                    ]
                }
            })
            setMessage('Cliente editado correctamente.')
            setSeverity('success')
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
    }

    const headCells = useMemo(() => [
        {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: "Cliente",
            sorter: (row) => `${row.first_name} ${row.last_name}`,
            accessor: (row) => `${row.first_name} ${row.last_name}`
        },
        {
            id: "document_number",
            numeric: false,
            disablePadding: true,
            label: "Doc./CUIT",
            sorter: (row) => row.document_number ? row.document_number.toString() : '',
            accessor: "document_number"
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
            id: "email",
            numeric: false,
            disablePadding: true,
            label: "Email",
            sorter: (row) => row.email ?? '',
            accessor: "email"
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
        },
        {
            id: 'work_place',
            numeric: false,
            disablePadding: true,
            label: 'Comercio',
            sorter: (row) => row.work_place,
            accessor: 'work_place'
        },
        {
            id: 'is_blocked',
            numeric: false,
            disablePadding: true,
            label: 'Bloqueado',
            sorter: (row) => row.is_blocked ? 1 : 0,
            accessor: (row) => (
                <Box sx={{ textAlign: 'center' }}>
                    <FormControlLabel
                        control={<Checkbox disabled={auth?.user.role !== 'ADMINISTRADOR'} />}
                        checked={row.is_blocked}
                        onChange={e => toggleBlocked({
                            ...row,
                            is_blocked: e.target.checked
                        })}
                    />
                </Box>
            )
        }
    ], [state.clients.data])

    return {
        loadingClients,
        setLoadingClients,
        handleSubmit,
        handleDelete,
        open,
        setOpen,
        getClients,
        toggleBlocked,
        clientFormData,
        headCells
    }
}