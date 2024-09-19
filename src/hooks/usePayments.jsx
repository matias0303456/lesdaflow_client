import { useContext, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"
import { useQuery } from "./useQuery"

import { PAYMENT_URL } from "../utils/urls"
// import { getSaleDifference } from "../utils/helpers"
import { STATUS_CODES } from "../utils/constants"

export function usePayments() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingPayments, setLoadingPayments] = useState(true)
    const [open, setOpen] = useState(null)

    const { handleQuery } = useQuery()

    // const checkDifference = (formData) => {
    //     if (formData.amount.toString().length === 0 || parseFloat(formData.amount) === 0) {
    //         setMessage('El importe es requerido.')
    //         setSeverity('error')
    //     } else {
    //         const diff = getSaleDifference(state.sales.data.find(s => s.id === formData.sale_id)).replace('$', '')
    //         if (parseFloat(diff) >= parseFloat(formData.amount)) return true
    //         setMessage(`El importe debe ser menor al saldo. Saldo actual: $${diff}`)
    //         setSeverity('error')
    //     }
    //     setOpenMessage(true)
    //     return false
    // }

    const handleSubmit = async (e, validate, formData, reset, setDisabled) => {
        e.preventDefault()
        // if (!checkDifference(formData)) return
        if (validate()) {
            const urls = { 'NEW': PAYMENT_URL, 'EDIT': `${PAYMENT_URL}/${formData.id}` }
            const methods = { 'NEW': 'POST', 'EDIT': 'PUT' }
            const { status, data } = await handleQuery({
                url: urls[open],
                method: methods[open],
                body: formData
            })
            if (status === STATUS_CODES.OK || status === STATUS_CODES.CREATED) {
                if (open === 'NEW') {
                    setMessage('Pago creado correctamente.')
                } else {
                    setMessage('Pago editado correctamente.')
                }
                setSeverity('success')
                reset(setOpen)
                return data
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
            return data
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