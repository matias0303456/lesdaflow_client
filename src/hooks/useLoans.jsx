import { useContext, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"
import { useQuery } from "./useQuery"

import { LOAN_URL } from "../utils/urls"
import { PAYMENT_FREQUENCIES, STATUS_CODES } from "../utils/constants"

export function useLoans() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { handleQuery } = useQuery()

    const [loans, setLoans] = useState([])
    const [loadingLoans, setLoadingLoans] = useState(true)
    const [open, setOpen] = useState(null)
    const [valueTab, setValueTab] = useState(0)

    async function getLoans() {
        const { status, data } = await handleQuery({ url: `${LOAN_URL}/${PAYMENT_FREQUENCIES[valueTab]}` })
        if (status === STATUS_CODES.OK) {
            setLoans(data)
            setLoadingLoans(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function handleSubmit(e, formData, validate, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const urls = { 'NEW': LOAN_URL, 'EDIT': `${LOAN_URL}/${formData.id}` }
            const methods = { 'NEW': 'POST', 'EDIT': 'PUT' }
            const { status, data } = await handleQuery({
                url: urls[open],
                method: methods[open],
                body: formData
            })
            if (status === STATUS_CODES.CREATED || status === STATUS_CODES.OK) {
                if (open === 'NEW') {
                    setLoans([data, ...loans])
                    setMessage('Préstamo creado correctamente.')
                } else {
                    setLoans([data, ...loans.filter(l => l.id !== data.id)])
                    setMessage('Préstamo editado correctamente.')
                    setOpenMessage(true)
                }
                reset(setOpen)
                setSeverity('success')
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        }
    }

    async function handleDelete(formData) {
        setLoadingLoans(true)
        const { status, data } = await handleQuery({
            url: `${LOAN_URL}/${formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setLoans([data, ...loans.filter(l => l.id !== data.id)])
            setMessage('Préstamo eliminado correctamente.')
            setSeverity('success')
        } else {
            if (status === STATUS_CODES.DATABASE_ERROR) {
                setMessage('El préstamo tiene datos asociados.')
            } else {
                setMessage('Ocurrió un error. Actualice la página.')
            }
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingLoans(false)
        setOpen(null)
    }

    return {
        loadingLoans,
        setLoadingLoans,
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        getLoans,
        loans,
        setLoans,
        valueTab,
        setValueTab
    }
}