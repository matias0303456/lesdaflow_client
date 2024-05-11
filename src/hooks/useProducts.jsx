import { useContext, useEffect, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"
import { PageContext } from "../providers/PageProvider"

import { PRODUCT_URL } from "../utils/urls"

export function useProducts() {

    const { page, offset, count, setCount, search } = useContext(PageContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { post, put, putMassive, putMassiveCostEarn, destroy } = useApi(PRODUCT_URL)

    const [loadingProducts, setLoadingProducts] = useState(true)
    const [products, setProducts] = useState([])
    const [open, setOpen] = useState(null)

    const { get } = useApi(PRODUCT_URL)

    useEffect(() => {
        (async () => {
            await getProducts()
        })()
    }, [])

    async function getProducts() {
        const { status, data } = await get(page['products'], offset['products'], search)
        if (status === 200) {
            setProducts(data[0])
            setCount({ ...count, 'products': data[1] })
            setLoadingProducts(false)
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

    async function handleSubmitMassive(
        massiveEdit,
        massiveEditPercentage,
        reset,
        setMassiveEdit,
        setMassiveEditPercentage,
        setDisabled
    ) {
        const body = {
            products: massiveEdit.map(me => ({ id: me.id, buy_price: me.buy_price })),
            percentage: parseFloat(massiveEditPercentage)
        }
        const { status, data } = await putMassive(body)
        if (status === 200) {
            setProducts([...data, ...products.filter(p => !data.map(d => d.id).includes(p.id))])
            setMessage('Precios actualizados correctamente.')
            setSeverity('success')
            setMassiveEdit([])
            setMassiveEditPercentage(0)
            reset(setOpen)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setOpenMessage(true)
    }

    async function handleUpdateCostAndEarn(
        massiveEdit,
        setMassiveEdit,
        massiveEditValue,
        setMassiveEditValue,
        massiveEditEarn,
        setMassiveEditEarn,
        reset,
        setDisabled
    ) {
        const body = {
            products: massiveEdit.map(me => ({
                id: me.id,
                buy_price: parseFloat(massiveEditValue),
                earn: parseFloat(massiveEditEarn)
            }))
        }
        const { status, data } = await putMassiveCostEarn(body)
        if (status === 200) {
            setProducts([...data, ...products.filter(p => !data.map(d => d.id).includes(p.id))])
            setMessage('Datos actualizados correctamente.')
            setSeverity('success')
            setMassiveEdit([])
            setMassiveEditValue(0)
            setMassiveEditEarn(0)
            reset(setOpen)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setOpenMessage(true)
    }

    async function handleDelete(elements) {
        setLoadingProducts(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setProducts([...products.filter(p => !ids.includes(p.id))])
            setMessage(`${result.length === 1 ? 'Producto eliminado' : 'Productos eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            if (result.some(r => r.status === 300)) {
                setMessage('Existen productos con datos asociados.')
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
        getProducts,
        open,
        setOpen,
        handleSubmit,
        handleSubmitMassive,
        handleDelete,
        handleUpdateCostAndEarn
    }
}