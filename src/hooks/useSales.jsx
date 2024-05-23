import { useContext, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { SALE_URL } from "../utils/urls"

export function useSales() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, destroy } = useApi(SALE_URL)

    const [loadingSales, setLoadingSales] = useState(true)
    const [sales, setSales] = useState([])
    const [open, setOpen] = useState(null)
    const [saleProducts, setSaleProducts] = useState([])
    const [idsToDelete, setIdsToDelete] = useState([])
    const [saleSaved, setSaleSaved] = useState(null)
    const [missing, setMissing] = useState(false)

    async function getSales() {
        const { status, data } = await get()
        if (status === 200) {
            setSales(data[0])
            setLoadingSales(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function handleSubmit(e, formData, validate, reset, setDisabled) {
        e.preventDefault()
        const submitData = {
            ...formData,
            sale_products: saleProducts,
            idsToDelete: idsToDelete.length === 0 ? undefined : idsToDelete
        }
        const spMissing = submitData.sale_products.length === 0 || submitData.sale_products.some(sp => !sp.amount || parseInt(sp.amount) <= 0)
        if (validate() && !spMissing) {
            const { status, data } = open === 'NEW' ? await post(submitData) : await put(submitData)
            if (status === 200) {
                if (open === 'NEW') {
                    setSales([data, ...sales])
                    setSaleSaved(data.id)
                } else {
                    setSeverity('success')
                    setSales([data, ...sales.filter(out => out.id !== formData.id)])
                    setMessage('Venta editada correctamente.')
                    setOpenMessage(true)
                }
                reset(setOpen)
                setSaleProducts([])
                setMissing(false)
                setIdsToDelete([])
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
                setOpenMessage(true)
            }
        } else {
            if (spMissing) {
                setDisabled(false)
                setMissing(true)
            }
        }
    }

    async function handleDelete(formData) {
        setLoadingSales(true)
        const { status, data } = await destroy(formData)
        if (status === 200) {
            setSales([...sales.filter(s => s.id !== data.id)])
            setMessage('Venta eliminada correctamente.')
            setSeverity('success')
        } else {
            if (status === 300) {
                setMessage('Existen ventas con datos asociados.')
            } else {
                setMessage('Ocurrió un error. Actualice la página.')
            }
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingSales(false)
        setOpen(null)
    }

    return {
        sales,
        setSales,
        loadingSales,
        setLoadingSales,
        open,
        setOpen,
        saleProducts,
        setSaleProducts,
        idsToDelete,
        setIdsToDelete,
        saleSaved,
        setSaleSaved,
        missing,
        setMissing,
        handleSubmit,
        handleDelete,
        getSales
    }
}