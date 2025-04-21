import { useContext, useMemo, useState } from "react"
import { Link } from "react-router-dom";
import { format } from "date-fns";

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"
import { DataContext } from "../providers/DataProvider"

import { BUDGET_URL } from "../utils/urls"
import { getBudgetTotal, getBudgetSubtotal } from "../utils/helpers";

export function useBudgets() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, destroy } = useApi(BUDGET_URL)

    const [loadingBudgets, setLoadingBudgets] = useState(true)
    const [open, setOpen] = useState(null)
    const [budgetArticles, setBudgetArticles] = useState([])
    const [idsToDelete, setIdsToDelete] = useState([])
    const [missing, setMissing] = useState(false)

    async function getBudgets(params) {
        const { status, data } = await get(params)
        if (status === 200) {
            dispatch({
                type: 'BUDGETS',
                payload: { ...state.budgets, data: data[0], count: data[1] }
            })
            setLoadingBudgets(false)
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
            budget_articles: budgetArticles,
            idsToDelete: idsToDelete.length === 0 ? undefined : idsToDelete
        }
        const baMissing = submitData.budget_articles.length === 0 || submitData.budget_articles.some(ba => !ba.amount || parseInt(ba.amount) <= 0)
        if (validate() && !baMissing) {
            const { status, data } = open === 'NEW' ? await post(submitData) : await put(submitData)
            if (status === 200) {
                if (open === 'NEW') {
                    dispatch({ type: 'BUDGETS', payload: { ...state.budgets, data: [data, ...state.budgets.data] } })
                    setMessage('Presupuesto creado correctamente.')
                } else {
                    dispatch({
                        type: 'BUDGETS',
                        payload: {
                            ...state.budgets,
                            data: [
                                data,
                                ...state.budgets.data.filter(b => b.id !== formData.id)
                            ]
                        }
                    })
                    setMessage('Presupuesto editado correctamente.')
                    setOpenMessage(true)
                }
                reset(setOpen)
                setSeverity('success')
                setBudgetArticles([])
                setMissing(false)
                setIdsToDelete([])
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        } else {
            if (baMissing) {
                setDisabled(false)
                setMissing(true)
            }
        }
    }

    async function handleDelete(formData) {
        setLoadingBudgets(true)
        const { status, data } = await destroy(formData)
        if (status === 200) {
            dispatch({
                type: 'BUDGETS',
                payload: {
                    ...state.budgets,
                    data: [...state.budgets.data.filter(b => b.id !== data.id)]
                }
            })
            setMessage(open === 'DELETE' ? 'Presupuesto eliminado correctamente.' : 'Venta creada y presupuesto eliminado correctamente.')
            setSeverity('success')
        } else {
            if (status === 300) {
                setMessage('Existen presupuestos con datos asociados.')
            } else {
                setMessage('Ocurrió un error. Actualice la página.')
            }
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingBudgets(false)
        setOpen(null)
    }

    const headCells = useMemo(() => [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Cod. Pres.',
            accessor: 'id'
        },
        {
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha',
            accessor: (row) => format(new Date(row.date), 'dd/MM/yy')
        },
        {
            id: 'hour',
            numeric: false,
            disablePadding: true,
            label: 'Hora',
            sorter: (row) => format(new Date(row.date), 'HH:mm').toString().replace(':', ''),
            accessor: (row) => format(new Date(row.date), 'HH:mm')
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
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            sorter: (row) => row.client.address,
            accessor: (row) => (
                <Link target="_blank" to={`https://www.google.com/maps?q=${row.client.address}`}>
                    <span style={{ color: '#050622' }}>{row.client.address}</span>
                </Link>
            )
        },
        {
            id: 'total_amount',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            sorter: (row) => parseFloat(getBudgetTotal(row, getBudgetSubtotal(row.budget_articles))),
            accessor: (row) => `$${getBudgetTotal(row, getBudgetSubtotal(row.budget_articles))}`
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: true,
            label: 'Tipo',
            accessor: (row) => row.type.replaceAll('CUENTA_CORRIENTE', 'CTA CTE')
        }
    ], [state.budgets.data])

    return {
        loadingBudgets,
        setLoadingBudgets,
        open,
        setOpen,
        budgetArticles,
        setBudgetArticles,
        idsToDelete,
        setIdsToDelete,
        missing,
        setMissing,
        handleSubmit,
        handleDelete,
        getBudgets,
        headCells
    }
}