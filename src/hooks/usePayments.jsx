import { useContext, useEffect, useState } from "react"

import { DataContext } from "../providers/DataProvider"
import { MessageContext } from "../providers/MessageProvider"
import { useApi } from "./useApi"

import { PAYMENT_URL } from "../utils/urls"

export function usePayments() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [open, setOpen] = useState(null)

    const { post, put, destroy } = useApi(PAYMENT_URL)

    const handleSubmit = async (e, validate, formData, reset, setDisabled) => {
        e.preventDefault()
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
            setMessage('Pago eliminado correctamente.')
            setSeverity('success')
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
        setOpen(null)
    }

    return { open, setOpen, handleSubmit, handleDelete }
}