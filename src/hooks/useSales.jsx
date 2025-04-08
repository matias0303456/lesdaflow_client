import { useContext, useState } from "react"
import { format } from "date-fns"

import { DataContext } from "../providers/DataProvider"
import { MessageContext } from "../providers/MessageProvider"
import { useApi } from "./useApi"
import { useBudgets } from "./useBudgets"

import { SALE_URL } from "../utils/urls"

export function useSales() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { handleDelete: deleteBudget } = useBudgets()
    const { get, post, put, destroy } = useApi(SALE_URL)

    const [loadingSales, setLoadingSales] = useState(true)
    const [open, setOpen] = useState(null)
    const [saleArticles, setSaleArticles] = useState([])
    const [idsToDelete, setIdsToDelete] = useState([])
    const [saleSaved, setSaleSaved] = useState(null)
    const [missing, setMissing] = useState(false)
    const [isBlocked, setIsBlocked] = useState(false)
    const [salesByClient, setSalesByClient] = useState([])

    async function getSales(params) {
        const { status, data } = await get(params)
        if (status === 200) {
            dispatch({
                type: 'SALES',
                payload: { ...state.sales, data: data[0], count: data[1] }
            })
            setLoadingSales(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function getSalesByClient(id) {
        const { status, data } = await get(`/by-client?client_id=${id}`)
        if (status === 200) {
            setSalesByClient(data)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function handleSubmit(e, formData, validate, reset, setDisabled, discountApplied) {
        e.preventDefault()
        const submitData = {
            ...formData,
            sale_articles: saleArticles,
            idsToDelete: idsToDelete.length === 0 ? undefined : idsToDelete,
            observations: discountApplied ? formData.observations += `- Descuento aplicado: ${discountApplied.name} (${format(new Date(Date.now()), 'dd/MM/yyyy')})\n` : formData.observations
        }
        const spMissing = submitData.sale_articles.length === 0 || submitData.sale_articles.some(sp => !sp.amount || parseInt(sp.amount) <= 0)
        if (validate() && !spMissing) {
            const { status, data } = open === 'NEW' || open === 'CONVERT' ? await post(submitData) : await put(submitData)
            if (status === 200) {
                if (open === 'NEW' || open === 'CONVERT') {
                    dispatch({ type: 'SALES', payload: { ...state.sales, data: [data, ...state.sales.data] } })
                    if (open === 'NEW') {
                        setMessage('Venta creada correctamente.')
                        setSaleSaved(data.id)
                    } else {
                        deleteBudget(formData)
                    }
                } else {
                    dispatch({
                        type: 'SALES',
                        payload: {
                            ...state.sales,
                            data: [
                                data,
                                ...state.sales.data.filter(s => s.id !== formData.id)
                            ]
                        }
                    })
                    setMessage('Venta editada correctamente.')
                    setOpenMessage(true)
                }
                reset(setOpen)
                setSeverity('success')
                setSaleArticles([])
                setMissing(false)
                setIdsToDelete([])
                setIsBlocked(false)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
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
            dispatch({
                type: 'SALES',
                payload: {
                    ...state.sales,
                    data: [...state.sales.data.filter(s => s.id !== data.id)]
                }
            })
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

    async function deliverSale(formData, reset) {
        const { status, data } = await put({ ...formData, is_delivered: true })
        if (status === 200) {
            dispatch({
                type: 'SALES',
                payload: {
                    ...state.sales,
                    data: [
                        data,
                        ...state.sales.data.filter(s => s.id !== data.id)
                    ]
                }
            })
            setMessage('Entrega registrada correctamente.')
            setSeverity('success')
            reset(setOpen)
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
    }

    return {
        loadingSales,
        setLoadingSales,
        open,
        setOpen,
        saleArticles,
        setSaleArticles,
        idsToDelete,
        setIdsToDelete,
        saleSaved,
        setSaleSaved,
        missing,
        setMissing,
        handleSubmit,
        handleDelete,
        getSales,
        isBlocked,
        setIsBlocked,
        deliverSale,
        getSalesByClient,
        salesByClient
    }
}