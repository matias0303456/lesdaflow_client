import { useContext, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { MessageContext } from "../providers/MessageProvider"
import { DataContext } from "../providers/DataProvider"
import { useApi } from "./useApi"
import { useForm } from "./useForm"

import { USER_URL } from "../utils/urls"
import { STATUS_CODES } from "../utils/constants"

export function useUsers() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, destroy } = useApi(USER_URL)
    const userFormData = useForm({
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
            role: 'VENDEDOR'
        },
        rules: {
            name: {
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
            document_number: {
                maxLength: 255
            },
            local_phone: {
                maxLength: 255
            },
            cell_phone: {
                maxLength: 255
            },
            address: {
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

    const [loadingUsers, setLoadingUsers] = useState(true)
    const [open, setOpen] = useState(null)
    const [newPwd, setNewPwd] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [count, setCount] = useState(0)
    const [businessNumbers, setBusinessNumbers] = useState([1])
    const [newBusinessNumber, setNewBusinessNumber] = useState('')
    const [filter, setFilter] = useState({
        page: 0,
        offset: 25,
        name: '',
        role: ''
    })

    async function getUsers(params) {
        const { status, data } = await get(params)
        if (status === STATUS_CODES.OK) {
            dispatch({ type: 'USERS', payload: data[0] })
            setCount(data[1])
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
        setLoadingUsers(false)
    }

    async function handleSubmit(e, validate, formData, setDisabled) {
        e.preventDefault()
        const submitData = {
            ...formData,
            business_numbers: businessNumbers
        }
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(submitData) : await put(submitData)
            if (status === STATUS_CODES.OK) {
                if (open === 'NEW') {
                    dispatch({ type: 'USERS', payload: [...state.users, data] })
                    setCount(count + 1)
                    setMessage('Usuario creado correctamente.')
                } else {
                    dispatch({
                        type: 'USERS',
                        payload: [
                            data,
                            ...state.users.filter(u => u.id !== formData.id)
                        ]
                    })
                    setMessage('Usuario editado correctamente.')
                }
                setSeverity('success')
                handleReset()
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        }
    }

    async function handleDelete(formData) {
        setLoadingUsers(true)
        const { status, data } = await destroy(formData)
        if (status === 200) {
            dispatch({
                type: 'USERS',
                payload: [...state.users.filter(u => u.id !== data.id)]
            })
            setCount(count - 1)
            setMessage('Usuario eliminado correctamente.')
            setSeverity('success')
        } else {
            if (status === 300) {
                setMessage('El usuario tiene datos asociados.')
            } else {
                setMessage('Ocurrió un error. Actualice la página.')
            }
            setSeverity('error')
        }
        handleReset()
        setLoadingUsers(false)
        setOpenMessage(true)
    }

    const headCells = useMemo(() => [
        {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: "Nombre y Apellido",
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
            accessor: (row) => (
                <Link target="_blank" to={`https://www.google.com/maps?q=${row.address}`}>
                    <span style={{ color: '#050622' }}>{row.address}</span>
                </Link>
            )
        },
        {
            id: "role",
            numeric: false,
            disablePadding: true,
            label: "Rol",
            sorter: (row) => row.role,
            accessor: "role"
        }
    ], [state.users])

    function handleReset() {
        userFormData.reset(setOpen)
        setBusinessNumbers([1])
        setNewBusinessNumber('')
    }

    return {
        loadingUsers,
        setLoadingUsers,
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        getUsers,
        newPwd,
        setNewPwd,
        count,
        filter,
        setFilter,
        showPassword,
        setShowPassword,
        userFormData,
        headCells,
        businessNumbers,
        setBusinessNumbers,
        newBusinessNumber,
        setNewBusinessNumber,
        handleReset
    }
}