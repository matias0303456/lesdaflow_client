import { useContext, useState } from "react"

import { DataContext } from "../providers/DataProvider"
import { MessageContext } from "../providers/MessageProvider"
import { useApi } from "./useQuery"

import { PAYMENT_URL } from "../utils/urls"
import { getSaleDifference } from "../utils/helpers"

export function usePayments() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingPayments, setLoadingPayments] = useState(true)
    const [open, setOpen] = useState(null)

    const { get, post, put, destroy } = useApi(PAYMENT_URL)

    async function getPayments(params) {
        const { status, data } = await get(params)
        if (status === 200) {
            dispatch({
                type: 'PAYMENTS',
                payload: { ...state.payments, data: data[0], count: data[1] }
            })
            setLoadingPayments(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    const checkDifference = (formData) => {
        if(formData.amount.toString().length === 0 || parseFloat(formData.amount) === 0){
            setMessage('El importe es requerido.')
            setSeverity('error')
        }else{
            const diff = getSaleDifference(state.sales.data.find(s => s.id === formData.sale_id)).replace('$', '')
            if (parseFloat(diff) >= parseFloat(formData.amount)) return true
            setMessage(`El importe debe ser menor al saldo. Saldo actual: $${diff}`)
            setSeverity('error')
        }
        setOpenMessage(true)
        return false
    }

    const handleSubmit = async (e, validate, formData, reset, setDisabled) => {
        e.preventDefault()
        if (!checkDifference(formData)) return
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    dispatch({
                        type: 'SALES',
                        payload: {
                            ...state.sales,
                            data: [
                                {
                                    ...state.sales.data.find(s => s.id === data.sale_id),
                                    payments: [
                                        data,
                                        ...state.sales.data.find(s => s.id === data.sale_id).payments
                                    ]
                                },
                                ...state.sales.data.filter(s => s.id !== data.sale_id)
                            ]
                        }
                    })
                    dispatch({ type: 'PAYMENTS', payload: { ...state.payments, data: [data, ...state.payments.data] } })
                    setMessage('Pago registrado correctamente.')
                } else {
                    dispatch({
                        type: 'SALES',
                        payload: {
                            ...state.sales,
                            data: [
                                {
                                    ...state.sales.data.find(s => s.id === data.sale_id),
                                    payments: [
                                        data,
                                        ...state.sales.data.find(s => s.id === data.sale_id).payments
                                            .filter(p => p.id !== data.id)
                                    ]
                                },
                                ...state.sales.data.filter(s => s.id !== data.sale_id)
                            ]
                        }
                    })
                    dispatch({
                        type: 'PAYMENTS',
                        payload: {
                            ...state.payments,
                            data: [
                                data,
                                ...state.payments.data.filter(p => p.id !== formData.id)
                            ]
                        }
                    })
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

    async function handleDelete(formData, reset) {
        const { status, data } = await destroy(formData)
        if (status === 200) {
            dispatch({
                type: 'SALES',
                payload: {
                    ...state.sales,
                    data: [
                        {
                            ...state.sales.data.find(s => s.id === data.sale_id),
                            payments: [
                                ...state.sales.data.find(s => s.id === data.sale_id).payments
                                    .filter(p => p.id !== data.id)
                            ]
                        },
                        ...state.sales.data.filter(s => s.id !== data.sale_id)
                    ]
                }
            })
            dispatch({
                type: 'PAYMENTS',
                payload: {
                    ...state.payments,
                    data: [...state.payments.data.filter(p => p.id !== data.id)]
                }
            })
            setMessage('Pago eliminado correctamente.')
            setSeverity('success')
            reset()
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
        setOpen(null)
    }

    async function cancelPayment(formData) {
        const { status, data } = await put(formData, '/cancel-payment')
        if (status === 200) {
            dispatch({
                type: 'PAYMENTS',
                payload: {
                    ...state.payments,
                    data: [
                        data,
                        ...state.payments.data.filter(p => p.id !== formData.id)
                    ]
                }
            })
            setMessage('Cancelación registrada correctamente.')
            setSeverity('success')
            setOpen(null)
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
    }

    return {
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        cancelPayment,
        getPayments,
        loadingPayments,
        setLoadingPayments
    }
}