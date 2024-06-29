import { useContext, useState } from "react"

import { AuthContext } from "../providers/AuthProvider"
import { MessageContext } from "../providers/MessageProvider"
import { DataContext } from "../providers/DataProvider"

import { INCOME_URL, OUTCOME_URL } from "../utils/urls"
import { useApi } from "./useApi"

export function useMovements() {

    const { auth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)
    const { state, dispatch } = useContext(DataContext)

    const { post: postIncomeByAmount } = useApi(INCOME_URL + '/by-amount')

    const [incomesByAmount, setIncomesByAmount] = useState([])
    const [amount, setAmount] = useState(1)
    const [open, setOpen] = useState(null)

    const handleSubmit = async (e, validate, formData, setDisabled, reset) => {
        e.preventDefault()
        if (validate()) {
            const res = await fetch(open === 'NEW_INCOME' ? INCOME_URL : OUTCOME_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth?.token
                },
                body: JSON.stringify({
                    product_id: formData.id,
                    amount: formData.amount,
                    observations: formData.observations
                })
            })
            const newMovement = await res.json()
            if (res.status === 200) {
                if (open === 'NEW_INCOME') {
                    dispatch({
                        type: 'PRODUCTS',
                        payload: {
                            ...state.products,
                            data: [
                                {
                                    ...state.products.data.find(p => p.id === newMovement.product_id),
                                    incomes: [
                                        newMovement,
                                        ...state.products.data.find(p => p.id === newMovement.product_id).incomes
                                            .filter(inc => inc.id !== newMovement.id)
                                    ]
                                },
                                ...state.products.data.filter(p => p.id !== newMovement.product_id)
                            ]
                        }
                    })
                    setMessage('Ingreso creado correctamente.')
                } else {
                    dispatch({
                        type: 'PRODUCTS',
                        payload: {
                            ...state.products,
                            data: [
                                {
                                    ...state.products.data.find(p => p.id === newMovement.product_id),
                                    outcomes: [
                                        newMovement,
                                        ...state.products.data.find(p => p.id === newMovement.product_id).outcomes
                                            .filter(out => out.id !== newMovement.id)
                                    ]
                                },
                                ...state.products.data.filter(p => p.id !== newMovement.product_id)
                            ]
                        }
                    })
                    setMessage('Egreso creado correctamente.')
                }
                reset(setOpen)
                setSeverity('success')
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        }
    }

    async function handleSubmitIncomesByAmount(e) {
        e.preventDefault()
        const { status, data } = await postIncomeByAmount({
            incomes: incomesByAmount.map(iba => ({
                amount,
                product_id: iba.product_id,
                observations: iba.observations
            }))
        })
        if (status === 200) {
            const newIncomeIds = data.map(d => d.product_id)
            dispatch({
                type: 'PRODUCTS',
                payload: {
                    ...state.products,
                    data: [
                        ...state.products.data.map(p => {
                            if (!newIncomeIds.includes(p.id)) return p
                            return {
                                ...p,
                                incomes: [
                                    ...p.incomes,
                                    ...data.filter(inc => inc.product_id === p.id)
                                ]
                            }
                        })
                    ]
                }
            })
            setMessage('Ingresos creados correctamente.')
            setSeverity('success')
            setAmount(1)
            setIncomesByAmount([])
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
    }

    return {
        open,
        setOpen,
        handleSubmit,
        incomesByAmount,
        setIncomesByAmount,
        amount,
        setAmount,
        handleSubmitIncomesByAmount
    }
}