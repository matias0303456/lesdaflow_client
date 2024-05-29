import { useContext, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"
import { DataContext } from "../providers/DataProvider"

import { BUDGET_URL } from "../utils/urls"

export function useBudgets() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, destroy } = useApi(BUDGET_URL)

    const [loadingBudgets, setLoadingBudgets] = useState(true)
    const [open, setOpen] = useState(null)
    const [budgetProducts, setBudgetProducts] = useState([])
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
            budget_products: budgetProducts,
            idsToDelete: idsToDelete.length === 0 ? undefined : idsToDelete
        }
        const bpMissing = submitData.budget_products.length === 0 || submitData.budget_products.some(bp => !bp.amount || parseInt(bp.amount) <= 0)
        if (validate() && !bpMissing) {
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
                setBudgetProducts([])
                setMissing(false)
                setIdsToDelete([])
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        } else {
            if (bpMissing) {
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
            setMessage('Presupuesto eliminado correctamente.')
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

    return {
        loadingBudgets,
        setLoadingBudgets,
        open,
        setOpen,
        budgetProducts,
        setBudgetProducts,
        idsToDelete,
        setIdsToDelete,
        missing,
        setMissing,
        handleSubmit,
        handleDelete,
        getBudgets
    }
}