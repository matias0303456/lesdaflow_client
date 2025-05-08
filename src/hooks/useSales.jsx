import { useContext, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { format } from "date-fns"

import { AuthContext } from "../providers/AuthProvider"
import { DataContext } from "../providers/DataProvider"
import { MessageContext } from "../providers/MessageProvider"
import { useApi } from "./useApi"
import { useBudgets } from "./useBudgets"
import { useForm } from "./useForm"

import { SALE_URL } from "../utils/urls"
import { getSaleDifference, getSaleTotal } from "../utils/helpers"

export function useSales() {

    const { auth } = useContext(AuthContext)
    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { handleDelete: deleteBudget } = useBudgets()
    const { get, post, put, destroy } = useApi(SALE_URL)
    const saleFormData = useForm({
        defaultData: {
            id: '',
            client_id: '',
            type: 'CUENTA_CORRIENTE',
            date: new Date(Date.now()),
            total: '0.00'
        },
        rules: {
            client_id: {
                required: true
            },
            date: {
                required: true
            }
        }
    })

    const [loadingSales, setLoadingSales] = useState(true)
    const [open, setOpen] = useState(null)
    const [saleProducts, setSaleProducts] = useState([])
    const [idsToDelete, setIdsToDelete] = useState([])
    const [saleSaved, setSaleSaved] = useState(null)
    const [missing, setMissing] = useState(false)
    const [isBlocked, setIsBlocked] = useState(false)
    const [salesByClient, setSalesByClient] = useState([])
    const [discountApplied, setDiscountApplied] = useState('')

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
            sale_products: saleProducts,
            idsToDelete: idsToDelete.length === 0 ? undefined : idsToDelete,
            discount_name: discountApplied ? discountApplied.name : formData.discount_name
        }
        const spMissing = submitData.sale_products.length === 0 || submitData.sale_products.some(sp => !sp.amount || parseInt(sp.amount) <= 0)
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
                setSaleProducts([])
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

    async function prepareSaleProduct(id, is_prepared) {
        const req = { id, is_prepared }
        const { status, data } = await put(req, '/update-sale-product')
        if (status === 200) {
            dispatch({
                type: 'SALES',
                payload: {
                    ...state.sales,
                    data: [
                        {
                            ...state.sales.data.find(s => s.id === data.sale_id),
                            sale_products: [
                                data,
                                ...state.sales.data.find(s => s.id === data.sale_id).sale_products
                                    .filter(sp => sp.id !== data.id)
                            ]
                        },
                        ...state.sales.data.filter(s => s.id !== data.sale_id)
                    ]
                }
            })
            setSaleProducts([data, ...saleProducts.filter(sp => sp.id !== data.id)].sort((a, b) => {
                if (a.product.code > b.product.code) return 1
                if (a.product.code < b.product.code) return -1
                return 0
            }))
            setMessage('Producto preparado correctamente.')
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
    }

    async function prepareAllSaleProducts(is_prepared) {
        const result = await Promise.allSettled(saleProducts.map(sp => {
            const req = { id: sp.id, is_prepared }
            return put(req, '/update-sale-product')
        }))
        if (result.every(r => r.status === 'fulfilled' && r.value.status === 200)) {
            dispatch({
                type: 'SALES',
                payload: {
                    ...state.sales,
                    data: [
                        {
                            ...state.sales.data.find(s => s.id === result[0].value.data.sale_id),
                            sale_products: result.map(r => r.value.data)
                        },
                        ...state.sales.data.filter(s => s.id !== result[0].value.data.sale_id)
                    ]
                }
            })
            setSaleProducts(result.map(r => r.value.data).sort((a, b) => {
                if (a.product.code > b.product.code) return 1
                if (a.product.code < b.product.code) return -1
                return 0
            }))
            setMessage('Productos preparados correctamente.')
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
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

    const headCells = useMemo(() => [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Cód.',
            accessor: 'id'
        },
        {
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha',
            accessor: (row) => format(new Date(row.date), 'dd/MM/yy HH:mm')
        },
        {
            id: 'seller',
            numeric: false,
            disablePadding: true,
            label: 'Vdor.',
            sorter: (row) => auth?.user.role === 'ADMINISTRADOR' ? row.created_by : row.client.user.name,
            accessor: (row) => auth?.user.role === 'ADMINISTRADOR' ? row.created_by : row.client.user.name
        },
        {
            id: 'client_name',
            numeric: false,
            disablePadding: true,
            label: 'Cliente',
            sorter: (row) => `${row.client.first_name} ${row.client.last_name}`,
            accessor: (row) => `${row.client.first_name} ${row.client.last_name}`
        },
        {
            id: 'work_place',
            numeric: false,
            disablePadding: true,
            label: 'Comercio',
            sorter: (row) => row.client.work_place ?? '',
            accessor: (row) => row.client.work_place
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Direcc.',
            sorter: (row) => row.client.address,
            accessor: (row) => (
                <Link target="_blank" to={`https://www.google.com/maps?q=${row.client.address}`}>
                    <span style={{ color: '#078BCD' }}>{row.client.address}</span>
                </Link>
            )
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: true,
            label: 'T. Vta.',
            accessor: (row) => row.type.replaceAll('CUENTA_CORRIENTE', 'CTA CTE')
        },
        {
            id: 'total',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            sorter: (row) => getSaleTotal(row).replace('$', ''),
            accessor: (row) => getSaleTotal(row)
        },
        {
            id: 'paid',
            numeric: false,
            disablePadding: true,
            label: 'Pagado',
            sorter: (row) => parseFloat(getSaleDifference(row).replace('$', '')) > 0 ? 1 : 0,
            accessor: (row) => parseFloat(getSaleDifference(row).replace('$', '')) > 0 ? 'No' : 'Sí'
        },
        {
            id: 'delivered',
            numeric: false,
            disablePadding: true,
            label: 'Entregado',
            sorter: (row) => row.is_delivered ? format(new Date(row.delivered_at), 'dd/MM/yy') : 'No',
            accessor: (row) => row.is_delivered ? format(new Date(row.delivered_at), 'dd/MM/yy') : 'No'
        }
    ], [state.sales.data])

    return {
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
        getSales,
        isBlocked,
        setIsBlocked,
        prepareSaleProduct,
        deliverSale,
        getSalesByClient,
        salesByClient,
        prepareAllSaleProducts,
        discountApplied,
        setDiscountApplied,
        saleFormData,
        headCells
    }
}