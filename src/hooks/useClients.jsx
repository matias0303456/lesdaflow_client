import { useContext, useState } from "react"

import { useApi } from "./useQuery"
import { MessageContext } from "../providers/MessageProvider"

import { CLIENT_URL } from "../utils/urls"
import { DataContext } from "../providers/DataProvider"

export function useClients() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { post, put, destroy } = useApi(CLIENT_URL)

    const [open, setOpen] = useState(null)
    const [loadingClients, setLoadingClients] = useState(true)

    const { get } = useApi(CLIENT_URL)

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

    return { loadingClients, setLoadingClients, handleSubmit, handleDelete, open, setOpen, getClients, toggleBlocked }
}