import { useContext, useMemo, useRef, useState } from "react"

import { AuthContext } from "../providers/AuthProvider"
import { MessageContext } from "../providers/MessageProvider"
import { DataContext } from "../providers/DataProvider"
import { useApi } from "./useApi"
import { useForm } from "./useForm"

import { ARTICLE_URL } from "../utils/urls"
import { STATUS_CODES } from "../utils/constants"

export function useArticles() {

    const { auth } = useContext(AuthContext)
    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, destroy } = useApi(ARTICLE_URL)
    const articleFormData = useForm({
        defaultData: {
            id: '',
            code: '',
            details: '',
            buy_price: 0.00,
            earn: 0.00,
            supplier_id: '',
            amount: 0,
            sale_price: 0
        },
        rules: {
            code: { required: true, maxLength: 55 },
            details: { required: true, maxLength: 191 },
            supplier_id: { required: true }
        }
    })

    const [open, setOpen] = useState(null)
    const [uploadedActFile, setUploadedActFile] = useState(null)
    const [uploadedNewFile, setUploadedNewFile] = useState(null)
    const [articleDiscounts, setArticleDiscounts] = useState([])
    const [articleSurcharges, setArticleSurcharges] = useState([])
    const [loadingArticles, setloadingArticles] = useState(true)
    const [count, setCount] = useState(0)
    const [filter, setFilter] = useState({
        page: 0,
        offset: 25,
        code: '',
        details: '',
        supplier_id: ''
    })

    const actPricesRef = useRef(null);
    const newArticlesRef = useRef(null);

    async function getArticles(params) {
        const { status, data } = await get(params)
        if (status === 200) {
            dispatch({ type: 'ARTICLES', payload: data[0] })
            setCount(data[1])
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
        setloadingArticles(false)
    }

    async function handleSubmit(e, validate, formData, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const submitData = {
                ...formData,
                discounts: articleDiscounts,
                surcharges: articleSurcharges
            }
            const { status, data } = open === 'NEW' ? await post(submitData) : await put(submitData)
            if (status === 200) {
                if (open === 'NEW') {
                    dispatch({ type: 'ARTICLES', payload: [data, ...state.articles] })
                    setCount(count + 1)
                    setMessage('Artículo creado correctamente.')
                } else {
                    dispatch({
                        type: 'ARTICLES',
                        payload: [
                            data,
                            ...state.articles.filter(p => p.id !== formData.id)
                        ]
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

    async function handleDelete(formData) {
        const { status, data } = await destroy(formData)
        if (status === 200) {
            dispatch({
                type: 'ARTICLES',
                payload: [...state.articles.filter(p => p.id !== data.id)]
            })
            setCount(count - 1)
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

    async function handleActPrices() {
        if (uploadedActFile !== null) {
            const isValidFile = uploadedActFile.name.endsWith('.xlsx') || uploadedActFile.name.endsWith('.xls');
            if (!isValidFile) {
                setMessage('Por favor, sube un archivo Excel (.xlsx o .xls)')
                setSeverity('error')
            } else {
                const formData = new FormData()
                formData.append('excelFile', uploadedActFile, uploadedActFile.name)
                const res = await fetch(ARTICLE_URL + '/act-prices', {
                    method: 'POST',
                    headers: { 'Authorization': auth?.token },
                    body: formData
                })
                const data = await res.json()
                const status = res.status
                if (status === STATUS_CODES.OK) {
                    setFilter({
                        page: 0,
                        offset: 25,
                        code: '',
                        details: '',
                        supplier_id: ''
                    })
                    setMessage(data.message)
                    setSeverity('success')
                    setUploadedActFile(null)
                    actPricesRef.current.value = null
                } else {
                    setMessage('Ocurrió un error al actualizar los precios.')
                    setSeverity('error')
                }
            }
            setOpenMessage(true)
        }
    }

    async function handleNewArticles() {
        if (uploadedNewFile !== null) {
            const isValidFile = uploadedNewFile.name.endsWith('.xlsx') || uploadedNewFile.name.endsWith('.xls');
            if (!isValidFile) {
                setMessage('Por favor, sube un archivo Excel (.xlsx o .xls)')
                setSeverity('error')
            } else {
                const formData = new FormData()
                formData.append('excelFile', uploadedNewFile, uploadedNewFile.name)
                const res = await fetch(ARTICLE_URL + '/new-articles', {
                    method: 'POST',
                    headers: { 'Authorization': auth?.token },
                    body: formData
                })
                const data = await res.json()
                const status = res.status
                if (status === STATUS_CODES.OK) {
                    if (data.errors.length === 0) {
                        setMessage(data.message)
                        setSeverity('success')
                    } else {
                        setMessage(`Error: ${data.errors.join(', ')}`)
                        setSeverity('error')
                    }
                    setFilter({
                        page: 0,
                        offset: 25,
                        code: '',
                        details: '',
                        supplier_id: ''
                    })
                    setUploadedNewFile(null)
                    newArticlesRef.current.value = null
                } else {
                    setMessage('Ocurrió un error al crear los artículos.')
                    setSeverity('error')
                }
            }
            setOpenMessage(true)
        }
    }

    const headCells = useMemo(() => [
        {
            id: 'code',
            numeric: false,
            disablePadding: true,
            label: 'Código',
            accessor: 'code'
        },
        {
            id: 'details',
            numeric: false,
            disablePadding: true,
            label: 'Artículo',
            accessor: 'details'
        },
        {
            id: 'older_price',
            numeric: false,
            disablePadding: true,
            label: 'Precio anterior',
            sorter: (row) => parseFloat(row.older_price).toFixed(2),
            accessor: (row) => parseFloat(row.older_price).toFixed(2)
        },
        {
            id: 'price',
            numeric: false,
            disablePadding: true,
            label: 'Precio actual',
            sorter: (row) => row.sale_price,
            accessor: (row) => row.sale_price
        },
        {
            id: 'supplier',
            numeric: false,
            disablePadding: true,
            label: 'Proveedor',
            sorter: (row) => row.supplier_name.toLowerCase(),
            accessor: (row) => row.supplier_name
        },
        {
            id: 'stock',
            numeric: false,
            disablePadding: true,
            label: 'Stock',
            sorter: (row) => row.stock,
            accessor: (row) => row.stock
        }
    ], [state.articles])

    return {
        open,
        setOpen,
        handleDelete,
        handleSubmit,
        getArticles,
        loadingArticles,
        setloadingArticles,
        articleFormData,
        headCells,
        actPricesRef,
        handleActPrices,
        uploadedActFile,
        setUploadedActFile,
        uploadedNewFile,
        setUploadedNewFile,
        filter,
        setFilter,
        count,
        articleDiscounts,
        articleSurcharges,
        setArticleDiscounts,
        setArticleSurcharges,
        handleNewArticles,
        newArticlesRef
    }
}