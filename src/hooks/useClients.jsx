import { useContext, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { CLIENT_URL } from "../utils/urls"

export function useClients() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { post, put, destroy } = useApi(CLIENT_URL)

    const [loadingClients, setLoadingClients] = useState(true)
    const [clients, setClients] = useState([])
    const [open, setOpen] = useState(null)

    const { get } = useApi(CLIENT_URL)

    async function getClients() {
        const { status, data } = await get()
        if (status === 200) {
            setClients(data[0])
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
                    setClients([data, ...clients])
                    setMessage('Cliente creado correctamente.')
                } else {
                    setClients([data, ...clients.filter(c => c.id !== formData.id)])
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
            setClients([...clients.filter(c => c.id !== data.id)])
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

    return { clients, setClients, loadingClients, setLoadingClients, handleSubmit, handleDelete, open, setOpen, getClients }
}