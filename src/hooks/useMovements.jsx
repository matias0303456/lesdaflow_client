import { useContext, useState } from "react"

import { AuthContext } from "../providers/AuthProvider"
import { MessageContext } from "../providers/MessageProvider"
import { DataContext } from "../providers/DataProvider"

import { INCOME_URL, OUTCOME_URL } from "../utils/urls"

export function useMovements() {

    const { auth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)
    const { state, dispatch } = useContext(DataContext)

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
                    article_id: formData.id,
                    amount: formData.amount,
                    observations: formData.observations
                })
            })
            const newMovement = await res.json()
            if (res.status === 200) {
                console.log({
                    ...state.articles,
                    data: [
                        {
                            ...state.articles.find(p => p.id === newMovement.article_id),
                            incomes: [
                                newMovement,
                                ...state.articles.find(p => p.id === newMovement.article_id).incomes
                                    .filter(inc => inc.id !== newMovement.id)
                            ]
                        },
                        ...state.articles.filter(p => p.id !== newMovement.article_id)
                    ]
                })
                if (open === 'NEW_INCOME') {
                    dispatch({
                        type: 'ARTICLES',
                        payload: [
                            {
                                ...state.articles.find(p => p.id === newMovement.article_id),
                                incomes: [
                                    newMovement,
                                    ...state.articles.find(p => p.id === newMovement.article_id).incomes
                                        .filter(inc => inc.id !== newMovement.id)
                                ]
                            },
                            ...state.articles.filter(p => p.id !== newMovement.article_id)
                        ]
                    })
                    setMessage('Ingreso creado correctamente.')
                } else {
                    dispatch({
                        type: 'ARTICLES',
                        payload: [
                            {
                                ...state.articles.find(p => p.id === newMovement.article_id),
                                outcomes: [
                                    newMovement,
                                    ...state.articles.find(p => p.id === newMovement.article_id).outcomes
                                        .filter(out => out.id !== newMovement.id)
                                ]
                            },
                            ...state.articles.filter(p => p.id !== newMovement.article_id)
                        ]
                    })
                    setMessage('Egreso creado correctamente.')
                }
                reset(setOpen)
                setSeverity('success')
            } else {
                setMessage(newMovement.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        }
    }

    return {
        open,
        setOpen,
        handleSubmit
    }
}