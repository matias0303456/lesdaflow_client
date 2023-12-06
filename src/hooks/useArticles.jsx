import { useContext, useEffect, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { ARTICLE_URL } from "../utils/urls"

export function useArticles(inventory = false) {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingArticles, setLoadingArticles] = useState(true)
    const [articles, setArticles] = useState([])

    const { get } = useApi(ARTICLE_URL + (inventory ? '?inventory=true' : ''))

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setArticles(data)
                setLoadingArticles(false)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
        })()
    }, [])

    return { articles, setArticles, loadingArticles, setLoadingArticles }
}