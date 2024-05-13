import { useContext, useEffect, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { SELLER_URL, USER_URL } from "../utils/urls"

export function useSellers() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingSellers, setLoadingSellers] = useState(true)
    const [sellers, setSellers] = useState([])
    const [open, setOpen] = useState(null)

    const { get } = useApi(SELLER_URL)
    const { post, put, destroy } = useApi(USER_URL)

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setSellers(data[0])
                setLoadingSellers(false)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
        })()
    }, [])

    async function handleSubmit(e, validate, formData, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setSellers([data, ...sellers])
                    setMessage('Vendedor creado correctamente.')
                } else {
                    setSellers([data, ...sellers.filter(s => s.id !== formData.id)])
                    setMessage('Vendedor editado correctamente.')
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
        setLoadingSellers(true)
        const { status, data } = await destroy(formData)
        if (status === 200) {
            setSellers([...sellers.filter(s => s.id !== data.id)])
            setMessage('Vendedor eliminado correctamente.')
            setSeverity('success')
        } else {
            if (status === 300) {
                setMessage('El vendedor tiene datos asociados.')
            } else {
                setMessage('Ocurrió un error. Actualice la página.')
            }
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingSellers(false)
        setOpen(null)
    }

    return { sellers, setSellers, loadingSellers, setLoadingSellers, open, setOpen, handleSubmit, handleDelete }
}