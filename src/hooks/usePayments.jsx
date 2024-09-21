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

    const handleSubmit = async (e, validate, formData, reset, setDisabled, loans, setLoans) => {
        e.preventDefault()
        if (validate()) {
            const urls = { 'NEW-PAYMENT': PAYMENT_URL, 'PAYMENT-DETAILS': `${PAYMENT_URL}/${formData.id}` }
            const methods = { 'NEW-PAYMENT': 'POST', 'PAYMENT-DETAILS': 'PUT' }
            const { status, data } = await handleQuery({
                url: urls[open],
                method: methods[open],
                body: formData
            })
            if (status === STATUS_CODES.OK || status === STATUS_CODES.CREATED) {
                const loan = loans.find(l => l.id === data.loan_id)
                if (open === 'NEW-PAYMENT') {
                    setLoans([
                        { ...loan, payments: [data, ...loan.payments] },
                        ...loans.filter(l => l.id !== data.loan_id)
                    ].sort((a, b) => {
                        if (a.id < b.id) return -1
                        if (a.id > b.id) return 1
                        return 0
                    }))
                    setMessage('Pago creado correctamente.')
                } else {
                    setLoans([
                        { ...loan, payments: [data, ...loan.payments.filter(p => p.id !== data.id)] },
                        ...loans.filter(l => l.id !== data.loan_id)
                    ].sort((a, b) => {
                        if (a.id < b.id) return -1
                        if (a.id > b.id) return 1
                        return 0
                    }))
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

    async function handleDelete(e, formData, loans, setLoans) {
        e.preventDefault()
        const { status, data } = await handleQuery({
            url: `${PAYMENT_URL}/${formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            const loan = loans.find(l => l.id === data.loan_id)
            setLoans([
                { ...loan, payments: [...loan.payments.filter(p => p.id !== data.id)] },
                ...loans.filter(l => l.id !== data.loan_id)
            ].sort((a, b) => {
                if (a.id < b.id) return -1
                if (a.id > b.id) return 1
                return 0
            }))
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