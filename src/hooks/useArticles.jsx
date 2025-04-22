import { useContext, useMemo, useRef, useState } from "react"

import { AuthContext } from "../providers/AuthProvider"
import { MessageContext } from "../providers/MessageProvider"
import { DataContext } from "../providers/DataProvider"
import { useApi } from "./useApi"
import { useForm } from "./useForm"

import { ARTICLE_URL } from "../utils/urls"
import { getStock } from "../utils/helpers"
import { STATUS_CODES } from "../utils/constants"

export function useArticles() {

    const { auth } = useContext(AuthContext)
    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, destroy } = useApi(ARTICLE_URL)
    const [open, setOpen] = useState(null)
    const articleFormData = useForm({
        defaultData: {
            id: '',
            code: '',
            details: '',
            price: '',
            supplier_id: '',
            amount: 0
        },
        rules: {
            code: { required: true, maxLength: 55 },
            details: { required: true, maxLength: 191 },
            price: { required: true },
            supplier_id: { required: true }
        }
    })

    const [loadingArticles, setloadingArticles] = useState(true)

    const actPricesRef = useRef(null);

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

    async function handleActPrices(e) {
        const file = e.target.files[0];
        if (file) {
            const isValidFile = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
            if (!isValidFile) {
                setMessage('Por favor, sube un archivo Excel (.xlsx o .xls)')
                setSeverity('error')
            } else {
                const formData = new FormData()
                formData.append('excelFile', file, file.name)
                const res = await fetch(ARTICLE_URL + '/act-prices', {
                    method: 'POST',
                    headers: { 'Authorization': auth?.token },
                    body: formData
                })
                const data = await res.json()
                const status = res.status
                if (status === STATUS_CODES.OK) {
                    dispatch({
                        type: 'ARTICLES',
                        payload: {
                            ...state.articles,
                            data: data[0],
                            count: data[1],
                            page: 0,
                            offset: 25,
                            filter_fields: { sale_id: '', from: '', to: '', p_type: '', created_by: '', loaded: false },
                            filters: ''
                        }
                    })
                    setMessage('Precios actualizados correctamente.')
                    setSeverity('success')
                    actPricesRef.current.value = null
                } else {
                    setMessage('Ocurrió un error al actualizar los precios.')
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
            sorter: (row) => parseFloat(row.price).toFixed(2),
            accessor: (row) => parseFloat(row.price).toFixed(2)
        },
        {
            id: 'supplier',
            numeric: false,
            disablePadding: true,
            label: 'Proveedor',
            sorter: (row) => row.supplier.name.toLowerCase(),
            accessor: (row) => row.supplier.name
        },
        {
            id: 'stock',
            numeric: false,
            disablePadding: true,
            label: 'Stock',
            sorter: (row) => getStock(row),
            accessor: (row) => getStock(row)
        }
    ], [state.articles.data])

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
        handleActPrices
    }
}