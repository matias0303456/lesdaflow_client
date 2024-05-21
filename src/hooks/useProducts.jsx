import { useContext, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"
import { DataContext } from "../providers/DataProvider"
import { useApi } from "./useApi"

import { PRODUCT_URL } from "../utils/urls"

export function useProducts() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, putMassive, destroy } = useApi(PRODUCT_URL)

    const [open, setOpen] = useState(null)
    const [massiveEdit, setMassiveEdit] = useState([])
    const [earnPrice, setEarnPrice] = useState(0)

    async function getProducts(params) {
        const { status, data } = await get(params)
        if (status === 200) {
            dispatch({
                type: 'PRODUCTS',
                payload: { ...state.products, data: data[0], count: data[1] }
            })
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
                    dispatch({ type: 'PRODUCTS', payload: { ...state.products, data: [data, ...state.products] } })
                    setMessage('Producto creado correctamente.')
                } else {
                    dispatch({
                        type: 'PRODUCTS',
                        payload: {
                            ...state.products,
                            data: [
                                data,
                                ...state.products.filter(p => p.id !== formData.id)
                            ]
                        }
                    })
                    setMessage('Producto editado correctamente.')
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

    async function handleSubmitMassive() {
        const body = {
            products: massiveEdit.map(me => {
                const product = state.products.find(p => p.id === me.product_id)
                return { ...me, buy_price: product.buy_price }
            })
        }
        const { status, data } = await putMassive(body)
        if (status === 200) {
            dispatch({
                type: 'PRODUCTS',
                payload: {
                    ...state.products,
                    data: [
                        data,
                        ...state.products.filter(p => !data.map(d => d.id).includes(p.id))
                    ]
                }
            })
            setMessage('Precios actualizados correctamente.')
            setSeverity('success')
            setMassiveEdit([])
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
    }

    async function handleDelete(formData) {
        const { status, data } = await destroy(formData)
        if (status === 200) {
            dispatch({
                type: 'PRODUCTS',
                payload: {
                    ...state.products,
                    data: [
                        data,
                        ...state.products.filter(p => p.id !== data.id)
                    ]
                }
            })
            setMessage('Producto eliminado correctamente.')
            setSeverity('success')
        } else {
            if (status === 300) {
                setMessage('El producto tiene datos asociados.')
            } else {
                setMessage('Ocurrió un error. Actualice la página.')
            }
            setSeverity('error')
        }
        setOpenMessage(true)
        setOpen(null)
    }

    return {
        open,
        setOpen,
        handleDelete,
        handleSubmit,
        handleSubmitMassive,
        massiveEdit,
        setMassiveEdit,
        earnPrice,
        setEarnPrice,
        getProducts
    }
}