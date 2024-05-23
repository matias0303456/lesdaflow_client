import { useContext, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { REGISTER_URL } from "../utils/urls"

export function useRegisters() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { post, put, destroy } = useApi(REGISTER_URL)

    const [loadingRegisters, setLoadingRegisters] = useState(true)
    const [registers, setRegisters] = useState([])
    const [open, setOpen] = useState(null)

    const { get } = useApi(REGISTER_URL)

    async function getRegisters() {
        setLoadingRegisters(true)
        const { status, data } = await get()
        if (status === 200) {
            setRegisters(data[0])
            setLoadingRegisters(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function handleSubmit(e, formData, reset, setDisabled) {
        e.preventDefault()
        const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
        if (status === 200) {
            if (open === 'NEW') {
                setRegisters([data, ...registers])
                setMessage('Caja abierta correctamente.')
            } else {
                setRegisters([data, ...registers.filter(r => r.id !== formData.id)])
                setMessage('Caja cerrada correctamente.')
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
            setRegisters([...registers.filter(r => r.id !== data.id)])
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

    return {
        registers,
        setRegisters,
        loadingRegisters,
        setLoadingRegisters,
        handleSubmit,
        handleDelete,
        open,
        setOpen,
        getRegisters
    }
}