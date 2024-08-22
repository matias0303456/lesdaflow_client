import { useContext, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"
import { useApi } from "./useApi"

import { COMMISSION_URL } from "../utils/urls"

export function useCommissions() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, destroy } = useApi(COMMISSION_URL)

    const [commissions, setCommissions] = useState([])
    const [loadingCommissions, setLoadingCommissions] = useState(true)
    const [open, setOpen] = useState(null)
    const [newCommissionValue, setNewCommissionValue] = useState(0)

    async function getCommissions(user_id) {
        const { status, data } = await get(`/${user_id}`)
        if (status === 200) {
            setCommissions(data)
            setLoadingCommissions(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function handleSubmit(e, formData) {
        e.preventDefault()
        const { status, data } = await post(formData)
        if (status === 200) {
            handleCloseCommissions()
            setCommissions([data, ...commissions])
            setMessage('Valor creado correctamente.')
            setSeverity('success')
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
    }

    async function handleDelete(formData) {
        const { status, data } = await destroy(formData)
        if (status === 200) {
            setCommissions([...commissions.filter(c => c.id !== data.id)])
            setMessage('Valor eliminado correctamente.')
            setSeverity('success')
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
        setOpen(null)
    }

    const handleCloseCommissions = () => {
        setOpen(null)
        setNewCommissionValue(0)
    }

    return {
        commissions,
        setCommissions,
        loadingCommissions,
        setLoadingCommissions,
        open,
        setOpen,
        getCommissions,
        handleSubmit,
        handleDelete,
        newCommissionValue,
        setNewCommissionValue,
        handleCloseCommissions
    }
}