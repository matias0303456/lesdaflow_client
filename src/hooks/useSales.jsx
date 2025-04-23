import { useContext, useMemo, useState } from "react"
import { format } from "date-fns"

import { DataContext } from "../providers/DataProvider"
import { MessageContext } from "../providers/MessageProvider"
import { useApi } from "./useApi"
import { useBudgets } from "./useBudgets"
import { useForm } from "./useForm"

import { SALE_URL } from "../utils/urls"
import { getSaleTotal } from "../utils/helpers"

export function useSales() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { handleDelete: deleteBudget } = useBudgets()
    const { get, post, put, destroy } = useApi(SALE_URL)

    const [filter, setFilter] = useState({
        page: 0,
        offset: 25,
        client: '',
        id: '',
        date: '',
        type: ''
    })
    const [count, setCount] = useState(0)
    const [loadingSales, setLoadingSales] = useState(true)
    const [open, setOpen] = useState(null)
    const [saleArticles, setSaleArticles] = useState([])
    const [idsToDelete, setIdsToDelete] = useState([])
    const [saleSaved, setSaleSaved] = useState(null)
    const [missing, setMissing] = useState(false)

    const saleFormData = useForm({
        defaultData: {
            id: '',
            client_id: '',
            type: 'CUENTA_CORRIENTE',
            date: new Date(Date.now()),
            observations: '',
            total: '0.00'
        },
        rules: {
            client_id: {
                required: true
            },
            date: {
                required: true
            },
            observations: {
                maxLength: 255
            }
        }
    })

    async function getSales(params) {
        const { status, data } = await get(params)
        if (status === 200) {
            dispatch({ type: 'SALES', payload: data[0] })
            setCount(data[1])
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
        setLoadingSales(false)
    }

    async function handleSubmit(e, formData, validate, reset, setDisabled) {
        e.preventDefault()
        const submitData = {
            ...formData,
            sale_articles: saleArticles,
            idsToDelete: idsToDelete.length === 0 ? undefined : idsToDelete,
        }
        const spMissing = submitData.sale_articles.length === 0 || submitData.sale_articles.some(sp => !sp.amount || parseInt(sp.amount) <= 0)
        if (validate() && !spMissing) {
            const { status, data } = open === 'NEW' || open === 'CONVERT' ? await post(submitData) : await put(submitData)
            if (status === 200) {
                if (open === 'NEW' || open === 'CONVERT') {
                    dispatch({ type: 'SALES', payload: [data, ...state.sales] })
                    setCount(count + 1)
                    if (open === 'NEW') {
                        setMessage('Venta creada correctamente.')
                        setSaleSaved(data.id)
                    } else {
                        deleteBudget(formData)
                    }
                } else {
                    dispatch({
                        type: 'SALES',
                        payload: [
                            data,
                            ...state.sales.filter(s => s.id !== formData.id)
                        ]
                    })
                    setMessage('Venta editada correctamente.')
                    setOpenMessage(true)
                }
                reset(setOpen)
                setSeverity('success')
                setSaleArticles([])
                setMissing(false)
                setIdsToDelete([])
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
                payload: [...state.sales.filter(s => s.id !== data.id)]
            })
            setCount(count - 1)
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
            sorter: (row) => row.created_by,
            accessor: (row) => row.created_by
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
        }
    ], [state.sales])

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
        headCells,
        saleFormData,
        filter,
        setFilter,
        count
    }
}