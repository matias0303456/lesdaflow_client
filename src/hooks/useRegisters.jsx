import { useContext, useEffect, useState } from "react"

import { PageContext } from "../providers/PageProvider"
import { MessageContext } from "../providers/MessageProvider"
import { AuthContext } from "../providers/AuthProvider"
import { useApi } from "./useApi"

import { REGISTER_URL } from "../utils/urls"

export function useRegisters() {

    const { auth } = useContext(AuthContext)
    const { page, offset, count, setCount } = useContext(PageContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)
    const { post, put, destroy } = useApi(REGISTER_URL)
    const { put: close } = useApi(REGISTER_URL + '/close')

    const [loadingRegisters, setLoadingRegisters] = useState(true)
    const [registers, setRegisters] = useState([])
    const [open, setOpen] = useState(null)

    const { get } = useApi(REGISTER_URL)

    useEffect(() => {
        (async () => {
            await getRegisters()
        })()
    }, [])

    async function getRegisters() {
        const { status, data } = await get(page['registers'], offset['registers'])
        if (status === 200) {
            setRegisters(data[0])
            setCount({ ...count, 'registers': data[1] })
            setLoadingRegisters(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    const someRegisterIsOpen = registers.some(r => r.is_open && r.user.id === auth.user.id) && open === 'NEW'

    const registerIsClosed = (formData) => !registers.find(r => r.id === formData.id)?.is_open && open === 'CLOSE-REGISTER'

    async function handleSubmit(e, formData, reset, setDisabled, setOpen) {
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
        const { status, data } = open === 'NEW' ? await post(formData) : open === 'EDIT' ? await put(formData) : await close(formData)
        if (status === 200) {
            if (open === 'NEW') {
                setRegisters([data, ...registers])
                setMessage('Caja abierta correctamente.')
            } else if (open === 'CLOSE-REGISTER') {
                setRegisters([data, ...registers.filter(r => r.id !== formData.id)])
                setMessage('Caja cerrada correctamente.')
            } else {
                setRegisters([data, ...registers.filter(r => r.id !== formData.id)])
                setMessage('Caja editada correctamente.')
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

    async function handleDelete(elements, setOpen) {
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

    return {
        registers,
        setRegisters,
        loadingRegisters,
        setLoadingRegisters,
        getRegisters,
        handleSubmit,
        handleDelete,
        open,
        setOpen
    }
}