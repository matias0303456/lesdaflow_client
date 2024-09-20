import { useContext, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"
import { useQuery } from "./useQuery"

import { PAYMENT_URL } from "../utils/urls"
import { STATUS_CODES } from "../utils/constants"

export function usePayments() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingPayments, setLoadingPayments] = useState(true)
    const [open, setOpen] = useState(null)

    const { handleQuery } = useQuery()

    const handleSubmit = async (e, validate, formData, reset, setDisabled) => {
        e.preventDefault()
        if (validate()) {
            const urls = { 'NEW-PAYMENT': PAYMENT_URL, 'EDIT': `${PAYMENT_URL}/${formData.id}` }
            const methods = { 'NEW-PAYMENT': 'POST', 'EDIT': 'PUT' }
            const { status, data } = await handleQuery({
                url: urls[open],
                method: methods[open],
                body: formData
            })
            if (status === STATUS_CODES.OK || status === STATUS_CODES.CREATED) {
                if (open === 'NEW-PAYMENT') {
                    setMessage('Pago creado correctamente.')
                } else {
                    setMessage('Pago editado correctamente.')
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
        const { status, data } = await handleQuery({
            url: `${PAYMENT_URL}/${formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setMessage('Pago eliminado correctamente.')
            setSeverity('success')
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
        setOpen(null)
    }

    return {
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        loadingPayments,
        setLoadingPayments
    }
}