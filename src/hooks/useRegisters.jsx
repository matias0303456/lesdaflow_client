import { useContext, useMemo, useState } from "react"
import { format } from "date-fns"

import { MessageContext } from "../providers/MessageProvider"
import { AuthContext } from "../providers/AuthProvider"
import { DataContext } from "../providers/DataProvider"
import { useApi } from "./useApi"
import { useForm } from "./useForm"

import { REGISTER_URL } from "../utils/urls"
import { setLocalDate } from "../utils/helpers"

export function useRegisters() {

    const { auth } = useContext(AuthContext)
    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, destroy } = useApi(REGISTER_URL)
    const registerFormData = useForm({
        defaultData: {
            id: '',
            user_id: auth?.user.id,
            amount: 0,
            created_at: new Date(Date.now()),
            updated_at: new Date(Date.now())
        }
    })

    const [filter, setFilter] = useState({
        page: 0,
        offset: 25,
        user: ''
    })
    const [count, setCount] = useState(0)
    const [loadingRegisters, setLoadingRegisters] = useState(true)
    const [open, setOpen] = useState(null)
    const [currentAmount, setCurrentAmount] = useState('')

    async function getRegisters(params) {
        const { status, data } = await get(params)
        if (status === 200) {
            dispatch({ type: 'REGISTERS', payload: data[0] })
            setCount(data[1])
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
        setLoadingRegisters(false)
    }

    const someRegisterIsOpen = state.registers.some(r => r.is_open && r.user.id === auth.user.id) && open === 'NEW'

    const registerIsClosed = (formData) => !state.registers.find(r => r.id === formData.id)?.is_open && open === 'SETTINGS'

    async function getCurrentRegister(formData) {
        if (registerIsClosed(formData)) return
        const { status, data } = await get(`/current?id=${formData.id}`)
        if (status === 200) {
            setCurrentAmount(data.end_amount)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function handleSubmit(e, formData, reset, setDisabled) {
        e.preventDefault()
        if (someRegisterIsOpen) {
            setMessage('Ya hay una caja abierta.')
            setSeverity('error')
            setOpenMessage(true)
            setDisabled(false)
            return
        }
        if (registerIsClosed(formData)) {
            setMessage('La caja está cerrada.')
            setSeverity('error')
            setOpenMessage(true)
            setDisabled(false)
            return
        }
        const { status, data } = open === 'NEW' ? await post(formData) : open === 'EDIT' ? await put(formData) : await put(formData, '/close')
        if (status === 200) {
            if (open === 'NEW') {
                dispatch({ type: 'REGISTERS', payload: [data, ...state.registers] })
                setCount(count + 1)
                setMessage('Caja abierta correctamente.')
            } else {
                dispatch({
                    type: 'REGISTERS',
                    payload: [
                        data,
                        ...state.registers.filter(r => r.id !== formData.id)
                    ]
                })
                if (open === 'EDIT') {
                    setMessage('Caja editada correctamente.')
                } else {
                    setMessage('Caja cerrada correctamente.')
                }
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

    async function handleDelete(formData) {
        setLoadingRegisters(true)
        const { status, data } = await destroy(formData)
        if (status === 200) {
            dispatch({
                type: 'REGISTERS',
                payload: [...state.registers.filter(r => r.id !== data.id)]
            })
            setCount(count - 1)
            setMessage('Caja eliminada correctamente.')
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingRegisters(false)
        setOpen(null)
    }

    const headCells = useMemo(() => [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: '#',
            sorter: (row) => parseInt(row.id),
            accessor: (row) => parseInt(row.id)
        },
        {
            id: "user",
            numeric: false,
            disablePadding: true,
            label: "Caja",
            sorter: (row) => row.user.username,
            accessor: (row) => row.user.username,
        },
        {
            id: "open_date",
            numeric: false,
            disablePadding: true,
            label: "Ap. Fecha",
            sorter: (row) => format(setLocalDate(row.created_at), 'dd/MM/yy'),
            accessor: (row) => format(setLocalDate(row.created_at), 'dd/MM/yy')
        },
        {
            id: "open_hour",
            numeric: false,
            disablePadding: true,
            label: "Ap. Hora",
            sorter: (row) => format(new Date(row.created_at), 'HH:mm:ss').toString().replace(':', ''),
            accessor: (row) => format(setLocalDate(row.created_at), 'HH:mm:ss')
        },
        {
            id: "open_amount",
            numeric: false,
            disablePadding: true,
            label: "Ap. Saldo",
            sorter: () => 0.00,
            accessor: () => '$0.00'
        },
        {
            id: "end_date",
            numeric: false,
            disablePadding: true,
            label: "Cierre Fecha",
            sorter: (row) => row.created_at === row.updated_at ? '-' : format(setLocalDate(row.updated_at), 'dd/MM/yy'),
            accessor: (row) => row.created_at === row.updated_at ? '-' : format(setLocalDate(row.updated_at), 'dd/MM/yy')
        },
        {
            id: "end_hour",
            numeric: false,
            disablePadding: true,
            label: "Cierre hora",
            sorter: (row) => row.created_at === row.updated_at ? '-' : format(new Date(row.updated_at), 'HH:mm:ss').toString().replace(':', ''),
            accessor: (row) => row.created_at === row.updated_at ? '-' : format(setLocalDate(row.updated_at), 'HH:mm:ss')
        },
        {
            id: "end_amount",
            numeric: false,
            disablePadding: true,
            label: "Cierre Saldo",
            sorter: (row) => parseFloat(row.end_amount.replace('$', '')),
            accessor: (row) => row.end_amount
        }
    ], [state.registers])

    return {
        loadingRegisters,
        setLoadingRegisters,
        handleSubmit,
        handleDelete,
        open,
        setOpen,
        getRegisters,
        currentAmount,
        getCurrentRegister,
        filter,
        setFilter,
        count,
        headCells,
        registerFormData
    }
}