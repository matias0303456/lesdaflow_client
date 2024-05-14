import { useContext, useEffect, useState } from "react"

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

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setRegisters(data[0])
                setLoadingRegisters(false)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
        })()
    }, [])

    async function handleSubmit(e) {
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

    async function handleDelete(elements) {
        setLoadingRegisters(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setRegisters([...registers.filter(r => !ids.includes(r.id))])
            setMessage(`${result.length === 1 ? 'Caja eliminada' : 'Cajas eliminadas'} correctamente.`)
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingRegisters(false)
        setOpen(null)
    }

    return { registers, setRegisters, loadingRegisters, setLoadingRegisters }
}