import { useContext, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"

import { INCOME_URL, OUTCOME_URL } from "../utils/urls"
import { useApi } from "./useApi"
import { SearchContext } from "../providers/SearchProvider"
import { PageContext } from "../providers/PageProvider"

export function useMovements() {

    const { page, offset, count, setCount, search } = useContext(PageContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)
    const { searchProducts, setSearchProducts } = useContext(SearchContext)

    const { get: getIncome, post: postIncome, put: putIncome, destroy: destroyIncome } = useApi(INCOME_URL)
    const { get: getOutcome, post: postOutcome, put: putOutcome, destroy: destroyOutcome } = useApi(OUTCOME_URL)

    const [loadingIncomes, setLoadingIncomes] = useState(true)
    const [incomes, setIncomes] = useState([])
    const [openIncome, setOpenIncome] = useState(null)
    const [loadingOutcomes, setLoadingOutcomes] = useState(true)
    const [outcomes, setOutcomes] = useState([])
    const [openOutcome, setOpenOutcome] = useState(null)
    const [oldFormDataAmount, setOldFormDataAmount] = useState(0)

    async function getIncomes() {
        const { status, data } = await getIncome(page['incomes'], offset['incomes'], search)
        if (status === 200) {
            setIncomes(data[0])
            setCount({ ...count, 'incomes': data[1] })
            setLoadingIncomes(false)
        }
    }

    async function handleSubmitIncome(e, formData, validate, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = openIncome === 'NEW' ? await postIncome(formData) : await putIncome(formData)
            if (status === 200) {
                if (openIncome === 'NEW') {
                    setIncomes([data, ...incomes])
                    setMessage('Ingreso creado correctamente.')
                } else {
                    setIncomes([data, ...incomes.filter(inc => inc.id !== formData.id)])
                    setMessage('Ingreso editado correctamente.')
                }
                setSearchProducts([
                    {
                        ...searchProducts.find(sp => sp.id === data.product_id),
                        stock: searchProducts.find(sp => sp.id === data.product_id).stock + data.amount
                    },
                    ...searchProducts.filter(sp => sp.id !== data.product_id)
                ])
                setSeverity('success')
                reset(setOpenIncome)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        }
    }

    async function handleDeleteIncome(elements) {
        setLoadingIncomes(true)
        const result = await Promise.all(elements.map(e => destroyIncome(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setIncomes([...incomes.filter(inc => !ids.includes(inc.id))])
            setSearchProducts(searchProducts.map(sp => {
                const pIds = result.map(r => r.data.product_id)
                if (pIds.includes(sp.id)) {
                    return {
                        ...sp,
                        stock: sp.stock - result
                            .filter(r => r.data.product_id === sp.id)
                            .reduce((prev, curr) => prev + curr.data.amount, 0)
                    }
                } else {
                    return sp
                }
            }))
            setMessage(`${result.length === 1 ? 'Ingreso eliminado' : 'Ingresos eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingIncomes(false)
        setOpenIncome(null)
    }

    async function getOutcomes(){
        const { status, data } = await getOutcome(page['outcomes'], offset['outcomes'], search)
        if (status === 200) {
            setOutcomes(data[0])
            setCount({ ...count, 'outcomes': data[1] })
            setLoadingOutcomes(false)
        }
    }

    async function handleSubmitOutcome(e, validate, formData, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await postOutcome(formData) : await putOutcome(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setOutcomes([data, ...outcomes])
                    setMessage('Ingreso creado correctamente.')
                } else {
                    setOutcomes([data, ...outcomes.filter(out => out.id !== formData.id)])
                    setMessage('Ingreso editado correctamente.')
                }
                setSearchProducts([
                    {
                        ...searchProducts.find(sp => sp.id === data.product_id),
                        stock: searchProducts.find(sp => sp.id === data.product_id).stock - data.amount
                    },
                    ...searchProducts.filter(sp => sp.id !== data.product_id)
                ])
                setSeverity('success')
                reset(setOpenOutcome)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        }
    }

    async function handleDeleteOutcome(elements) {
        setLoadingOutcomes(true)
        const result = await Promise.all(elements.map(e => destroyOutcome(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setOutcomes([...outcomes.filter(out => !ids.includes(out.id))])
            setSearchProducts(searchProducts.map(sp => {
                const pIds = result.map(r => r.data.product_id)
                if (pIds.includes(sp.id)) {
                    return {
                        ...sp,
                        stock: sp.stock + result
                            .filter(r => r.data.product_id === sp.id)
                            .reduce((prev, curr) => prev + curr.data.amount, 0)
                    }
                } else {
                    return sp
                }
            }))
            setMessage(`${result.length === 1 ? 'Egreso eliminado' : 'Egresos eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingOutcomes(false)
        setOpenOutcome(null)
    }

    return {
        getIncomes,
        handleSubmitIncome,
        handleDeleteIncome,
        incomes,
        setIncomes,
        loadingIncomes,
        setLoadingIncomes,
        openIncome,
        setOpenIncome,
        oldFormDataAmount,
        setOldFormDataAmount,
        loadingOutcomes,
        setLoadingOutcomes,
        openOutcome,
        setOpenOutcome,
        getOutcomes,
        handleSubmitOutcome,
        handleDeleteOutcome
    }
}