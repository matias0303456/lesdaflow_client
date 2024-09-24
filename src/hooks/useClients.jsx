import { useContext, useState } from "react"

import { useQuery } from "./useQuery"
import { MessageContext } from "../providers/MessageProvider"

import { CLIENT_URL } from "../utils/urls"
import { STATUS_CODES } from "../utils/constants"

export function useClients() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { handleQuery } = useQuery()

    const [clients, setClients] = useState([])
    const [count, setCount] = useState(0)
    const [open, setOpen] = useState(null)
    const [loadingClients, setLoadingClients] = useState(true)
    const [filter, setFilter] = useState({
        page: 0,
        offset: 25
    })

    async function getClients(params) {
        const { status, data } = await handleQuery({
            url: `${CLIENT_URL}${params ? params : ''}`
        })
        if (status === STATUS_CODES.OK) {
            setClients(data[0])
            setCount(data[1])
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
            const urls = { 'NEW': CLIENT_URL, 'EDIT': `${CLIENT_URL}/${formData.id}` }
            const methods = { 'NEW': 'POST', 'EDIT': 'PUT' }
            const { status, data } = await handleQuery({
                url: urls[open],
                method: methods[open],
                body: formData
            })
            if (status === STATUS_CODES.OK || status === STATUS_CODES.CREATED) {
                if (open === 'NEW') {
                    setClients([data, ...clients])
                    setCount(prev => prev + 1)
                    setMessage('Cliente creado correctamente.')
                } else {
                    setClients([data, ...clients.filter(c => c.id !== data.id)])
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

    async function toggleActive(formData) {
        const { status, data } = await handleQuery({
            url: `${CLIENT_URL}/${formData.id}`,
            method: 'PUT',
            body: formData
        })
        if (status === STATUS_CODES.OK) {
            setClients([data, ...clients.filter(c => c.id !== data.id)])
            setMessage('Cliente modificado correctamente.')
            setSeverity('success')
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
    }

    async function handleDelete(formData) {
        setLoadingClients(true)
        const { status, data } = await handleQuery({
            url: `${CLIENT_URL}/${formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setClients(clients.filter(c => c.id !== data.id))
            setCount(prev => prev - 1)
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
        clients,
        count,
        filter,
        setFilter,
        toggleActive
    }
}