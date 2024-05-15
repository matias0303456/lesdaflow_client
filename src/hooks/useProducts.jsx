import { useContext, useEffect, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { PRODUCT_URL } from "../utils/urls"

export function useProducts() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, putMassive, destroy } = useApi(PRODUCT_URL)

    const [loadingProducts, setLoadingProducts] = useState(true)
    const [products, setProducts] = useState([])
    const [open, setOpen] = useState(null)
    const [massiveEdit, setMassiveEdit] = useState([])
    const [massiveEditPercentage, setMassiveEditPercentage] = useState(0)
    const [earnPrice, setEarnPrice] = useState(0)

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setProducts(data[0])
                setLoadingProducts(false)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
        })()
    }, [])

    async function handleSubmit(e, validate, formData, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setProducts([data, ...products])
                    setMessage('Producto creado correctamente.')
                } else {
                    setProducts([data, ...products.filter(p => p.id !== formData.id)])
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

    async function handleSubmitMassive(reset, setDisabled) {
        const body = {
            products: massiveEdit.map(me => ({ id: me.id, buy_price: me.buy_price })),
            percentage: parseInt(massiveEditPercentage)
        }
        const { status, data } = await putMassive(body)
        if (status === 200) {
            setProducts([...data, ...products.filter(p => !data.map(d => d.id).includes(p.id))])
            setMessage('Precios actualizados correctamente.')
            setSeverity('success')
            reset(setOpen)
            setMassiveEdit([])
            setMassiveEditPercentage(0)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setOpenMessage(true)
    }

    async function handleDelete(formData) {
        setLoadingProducts(true)
        const { status, data } = await destroy(formData)
        if (status === 200) {
            setProducts([...products.filter(p => p.id !== data.id)])
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
        setLoadingProducts(false)
        setOpen(null)
    }

    return {
        products,
        setProducts,
        loadingProducts,
        setLoadingProducts,
        open,
        setOpen,
        handleDelete,
        handleSubmit,
        handleSubmitMassive,
        massiveEdit,
        setMassiveEdit,
        massiveEditPercentage,
        setMassiveEditPercentage,
        earnPrice,
        setEarnPrice
    }
}