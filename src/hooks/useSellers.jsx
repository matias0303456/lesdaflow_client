import { useContext, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"
import { DataContext } from "../providers/DataProvider"
import { useApi } from "./useApi"

import { SELLER_URL, USER_URL } from "../utils/urls"

export function useSellers() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingSellers, setLoadingSellers] = useState(true)
    const [open, setOpen] = useState(null)

    const { get } = useApi(SELLER_URL)
    const { post, put, destroy } = useApi(USER_URL)

    async function getSellers(params) {
        setLoadingSellers(true)
        const { status, data } = await get(params)
        if (status === 200) {
            dispatch({
                type: 'SELLERS',
                payload: { ...state.sellers, data: data[0], count: data[1] }
            })
            setLoadingSellers(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }
    async function handleSubmit(e, validate, formData, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    dispatch({ type: 'SELLERS', payload: { ...state.sellers, data: [data, ...state.sellers.data] } })
                    setMessage('Vendedor creado correctamente.')
                } else {
                    dispatch({
                        type: 'SELLERS',
                        payload: {
                            ...state.sellers,
                            data: [
                                data,
                                ...state.sellers.data.filter(s => s.id !== formData.id)
                            ]
                        }
                    })
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
            dispatch({
                type: 'SELLERS',
                payload: {
                    ...state.sellers,
                    data: [...state.sellers.data.filter(s => s.id !== data.id)]
                }
            })
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

    return { loadingSellers, setLoadingSellers, open, setOpen, handleSubmit, handleDelete, getSellers }
}