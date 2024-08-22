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
    const [newCommissionDate, setNewCommissionDate] = useState(new Date(Date.now()))
    const [newCommissionType, setNewCommissionType] = useState('CUENTA_CORRIENTE')
    const [loadingTables, setLoadingTables] = useState(false)
    const [calculations, setCalculations] = useState({
        seller: '',
        'CUENTA_CORRIENTE': {
            sales: [],
            total: 0,
            commission: 0
        },
        'CONTADO': {
            sales: [],
            total: 0,
            commission: 0
        },
        'POXIPOL': {
            sales: [],
            total: 0,
            commission: 0
        }
    })

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
            setCommissions([data, ...commissions].sort((a, b) => {
                if (a.date < b.date) return 1
                if (a.date > b.date) return -1
                return 0
            }))
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

    async function handleCloseCommissions() {
        setOpen(null)
        setNewCommissionValue(0)
        setNewCommissionDate(new Date(Date.now()))
        setNewCommissionType('CUENTA_CORRIENTE')
    }

    async function handleCalculateCommissions({ to, user_id }) {
        const { status, data } = await get(`/calculate-commissions/${to.toISOString()}/${user_id}`)
        if (status === 200) {
            setCalculations(data)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
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
        handleCloseCommissions,
        newCommissionDate,
        setNewCommissionDate,
        newCommissionType,
        setNewCommissionType,
        loadingTables,
        setLoadingTables,
        handleCalculateCommissions,
        calculations,
        setCalculations
    }
}