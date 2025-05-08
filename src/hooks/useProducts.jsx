import { useContext, useMemo, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"
import { DataContext } from "../providers/DataProvider"
import { useApi } from "./useApi"
import { useForm } from "./useForm"

import { PRODUCT_URL } from "../utils/urls"
import { getStock } from "../utils/helpers"

export function useProducts() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, putMassive, destroy } = useApi(PRODUCT_URL)
    const [open, setOpen] = useState(null)
    const productFormData = useForm({
        defaultData: {
            id: '',
            code: '',
            details: '',
            buy_price: '',
            min_stock: '',
            earn: '',
            supplier_id: '',
            cash: true,
            cta_cte: true,
            poxipol: false,
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

    const [loadingProducts, setLoadingProducts] = useState(true)
    const [massiveEdit, setMassiveEdit] = useState([])
    const [earnPrice, setEarnPrice] = useState(0)
    const [productHistory, setProductHistory] = useState([])

    async function getProducts(params) {
        const { status, data } = await get(params)
        if (status === 200) {
            dispatch({
                type: 'PRODUCTS',
                payload: { ...state.products, data: data[0], count: data[1] }
            })
            setLoadingProducts(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function searchProducts(params) {
        const { status, data } = await get('/search' + params)
        if (status === 200) {
            return { status, data }
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function getProductHistory(id) {
        if (id.toString().length > 0) {
            setLoadingProducts(true)
            const { status, data } = await get(`/history/${id}`)
            if (status === 200) {
                setProductHistory(data)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
            setLoadingProducts(false)
        }
    }

    async function handleSubmit(e, validate, formData, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    dispatch({ type: 'PRODUCTS', payload: { ...state.products, data: [data, ...state.products.data] } })
                    setMessage('Producto creado correctamente.')
                } else {
                    dispatch({
                        type: 'PRODUCTS',
                        payload: {
                            ...state.products,
                            data: [
                                data,
                                ...state.products.data.filter(p => p.id !== formData.id)
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
                        ...state.products.data.filter(p => !data.map(d => d.id).includes(p.id))
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
                    data: [...state.products.data.filter(p => p.id !== data.id)]
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

    const headCells = useMemo(() => [
        {
            id: 'code',
            numeric: false,
            disablePadding: true,
            label: 'Código',
            accessor: 'code',
            can_access: ['CHOFER', 'VENDEDOR']
        },
        {
            id: 'details',
            numeric: false,
            disablePadding: true,
            label: 'Producto',
            accessor: 'details',
            can_access: ['CHOFER', 'VENDEDOR']
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
            can_access: ['CHOFER', 'VENDEDOR']
        },
        {
            id: 'supplier',
            numeric: false,
            disablePadding: true,
            label: 'Proveedor',
            sorter: (row) => row.supplier.name.toLowerCase(),
            accessor: (row) => row.supplier.name,
            can_access: ['CHOFER', 'VENDEDOR']
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
    ], [state.products.data])

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
        getProducts,
        loadingProducts,
        setLoadingProducts,
        searchProducts,
        productHistory,
        getProductHistory,
        productFormData,
        headCells
    }
}