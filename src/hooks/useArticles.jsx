import { useContext, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"
import { DataContext } from "../providers/DataProvider"
import { useApi } from "./useApi"

import { ARTICLE_URL } from "../utils/urls"

export function useArticles() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, putMassive, destroy } = useApi(ARTICLE_URL)

    const [open, setOpen] = useState(null)
    const [loadingArticles, setloadingArticles] = useState(true)
    const [massiveEdit, setMassiveEdit] = useState([])
    const [earnPrice, setEarnPrice] = useState(0)
    const [articleHistory, setArticleHistory] = useState([])

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

    async function searchArticles(params) {
        const { status, data } = await get('/search' + params)
        if (status === 200) {
            return { status, data }
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function getArticleHistory(id) {
        if (id.toString().length > 0) {
            setloadingArticles(true)
            const { status, data } = await get(`/history/${id}`)
            if (status === 200) {
                setArticleHistory(data)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
            setloadingArticles(false)
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

    async function handleSubmitMassive() {
        const body = {
            articles: massiveEdit.map(me => {
                const article = state.articles.find(p => p.id === me.article_id)
                return { ...me, buy_price: article.buy_price }
            })
        }
        const { status, data } = await putMassive(body)
        if (status === 200) {
            dispatch({
                type: 'ARTICLES',
                payload: {
                    ...state.articles,
                    data: [
                        data,
                        ...state.articles.data.filter(p => !data.map(d => d.id).includes(p.id))
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
        getArticles,
        loadingArticles,
        setloadingArticles,
        searchArticles,
        articleHistory,
        getArticleHistory
    }
}