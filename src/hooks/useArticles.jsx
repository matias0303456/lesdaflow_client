import { useContext, useMemo, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"
import { DataContext } from "../providers/DataProvider"
import { useApi } from "./useApi"
import { useForm } from "./useForm"

import { ARTICLE_URL } from "../utils/urls"
import { getStock } from "../utils/helpers"

export function useArticles() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, putMassive, destroy } = useApi(ARTICLE_URL)
    const [open, setOpen] = useState(null)
    const articleFormData = useForm({
        defaultData: {
            id: '',
            code: '',
            details: '',
            buy_price: '',
            min_stock: '',
            earn: '',
            supplier_id: '',
            amount: ''
        },
        rules: {
            code: { required: true, maxLength: 55 },
            details: { required: true, maxLength: 191 },
            buy_price: { required: true },
            min_stock: { required: true },
            earn: { required: true },
            supplier_id: { required: true },
            amount: { required: open === 'NEW' }
        }
    })

    const [loadingArticles, setloadingArticles] = useState(true)
    const [massiveEdit, setMassiveEdit] = useState([])
    const [earnPrice, setEarnPrice] = useState(0)
    const [articleHistory, setArticleHistory] = useState([])

    async function getArticles(params) {
        const { status, data } = await get(params)
        if (status === 200) {
            dispatch({
                type: 'ARTICLES',
                payload: { ...state.articles, data: data[0], count: data[1] }
            })
            setloadingArticles(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function searchArticles(params) {
        const { status, data } = await get('/search' + params)
        if (status === 200) {
            return { status, data }
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function getArticleHistory(id) {
        if (id.toString().length > 0) {
            setloadingArticles(true)
            const { status, data } = await get(`/history/${id}`)
            if (status === 200) {
                setArticleHistory(data)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
            setloadingArticles(false)
        }
    }

    async function handleSubmit(e, validate, formData, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    dispatch({ type: 'ARTICLES', payload: { ...state.articles, data: [data, ...state.articles.data] } })
                    setMessage('Artículo creado correctamente.')
                } else {
                    dispatch({
                        type: 'ARTICLES',
                        payload: {
                            ...state.articles,
                            data: [
                                data,
                                ...state.articles.data.filter(p => p.id !== formData.id)
                            ]
                        }
                    })
                    setMessage('Artículo editado correctamente.')
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
            articles: massiveEdit.map(me => {
                const article = state.articles.find(p => p.id === me.article_id)
                return { ...me, buy_price: article.buy_price }
            })
        }
        const { status, data } = await putMassive(body)
        if (status === 200) {
            dispatch({
                type: 'ARTICLES',
                payload: {
                    ...state.articles,
                    data: [
                        data,
                        ...state.articles.data.filter(p => !data.map(d => d.id).includes(p.id))
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
                type: 'ARTICLES',
                payload: {
                    ...state.articles,
                    data: [...state.articles.data.filter(p => p.id !== data.id)]
                }
            })
            setMessage('Artículo eliminado correctamente.')
            setSeverity('success')
        } else {
            if (status === 300) {
                setMessage('El artículo tiene datos asociados.')
            } else {
                setMessage('Ocurrió un error. Actualice la página.')
            }
            setSeverity('error')
        }
        setOpenMessage(true)
        setOpen(null)
    }

    const headCells = useMemo(() => [
        {
            id: 'code',
            numeric: false,
            disablePadding: true,
            label: 'Código',
            accessor: 'code',
            can_access: ['VENDEDOR']
        },
        {
            id: 'details',
            numeric: false,
            disablePadding: true,
            label: 'Artículo',
            accessor: 'details',
            can_access: ['VENDEDOR']
        },
        {
            id: 'buy_price',
            numeric: false,
            disablePadding: true,
            label: 'P. compra',
            sorter: (row) => parseFloat(row.buy_price).toFixed(2),
            accessor: (row) => parseFloat(row.buy_price).toFixed(2)
        },
        {
            id: 'earn',
            numeric: false,
            disablePadding: true,
            label: '% Gan.',
            accessor: 'earn'
        },
        {
            id: 'sale_price',
            numeric: false,
            disablePadding: true,
            label: 'P. venta',
            sorter: (row) => parseFloat((row.buy_price + ((row.buy_price / 100) * row.earn)).toFixed(2)),
            accessor: (row) => `$${(row.buy_price + ((row.buy_price / 100) * row.earn)).toFixed(2)}`,
            can_access: ['VENDEDOR']
        },
        {
            id: 'supplier',
            numeric: false,
            disablePadding: true,
            label: 'Proveedor',
            sorter: (row) => row.supplier.name.toLowerCase(),
            accessor: (row) => row.supplier.name,
            can_access: ['VENDEDOR']
        },
        {
            id: 'stock',
            numeric: false,
            disablePadding: true,
            label: 'Stock',
            sorter: (row) => getStock(row),
            accessor: (row) => getStock(row),
            can_access: ['VENDEDOR']
        },
        {
            id: 'min_stock',
            numeric: false,
            disablePadding: true,
            label: 'Stock mínimo',
            accessor: 'min_stock'
        }
    ], [state.articles.data])

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
        getArticles,
        loadingArticles,
        setloadingArticles,
        searchArticles,
        articleHistory,
        getArticleHistory,
        articleFormData,
        headCells
    }
}