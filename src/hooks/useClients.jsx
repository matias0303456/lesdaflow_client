import { useContext, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { DataContext } from "../providers/DataProvider"
import { MessageContext } from "../providers/MessageProvider"
import { useApi } from "./useApi"
import { useForm } from "./useForm"

import { CLIENT_URL } from "../utils/urls"

export function useClients() {

    const { state, dispatch } = useContext(DataContext)
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
            address: ''
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
            email: {
                maxLength: 255
            }
        }
    })

    const [open, setOpen] = useState(null)
    const [loadingClients, setLoadingClients] = useState(true)
    const [count, setCount] = useState(0)
    const [filter, setFilter] = useState({
        page: 0,
        offset: 25,
        first_name: '',
        last_name: ''
    })

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
                    <span style={{ color: '#050622' }}>{row.address}</span>
                </Link>
            )
        }
    ], [state.clients])

    async function getClients(params) {
        const { status, data } = await get(params)
        if (status === 200) {
            dispatch({ type: 'CLIENTS', payload: data[0] })
            setCount(data[1])
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
        setLoadingClients(false)
    }

    async function handleSubmit(e, validate, formData, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    dispatch({ type: 'CLIENTS', payload: [data, ...state.clients] })
                    setCount(count + 1)
                    setMessage('Cliente creado correctamente.')
                } else {
                    dispatch({
                        type: 'CLIENTS',
                        payload: [
                            data,
                            ...state.clients.filter(c => c.id !== formData.id)
                        ]
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
                payload: [...state.clients.filter(c => c.id !== data.id)]
            })
            setCount(count - 1)
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

    return {
        loadingClients,
        setLoadingClients,
        handleSubmit,
        handleDelete,
        open,
        setOpen,
        getClients,
        clientFormData,
        headCells,
        filter,
        setFilter,
        count
    }
}