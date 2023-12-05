import { useContext, useEffect } from "react"

import { useApi } from "./useApi"
import { ArticleContext } from "../providers/ArticleProvider"

import { ARTICLE_URL } from "../utils/urls"

export function useArticles() {

    const { get } = useApi(ARTICLE_URL)

    const { articles, setArticles, setLoading } = useContext(ArticleContext)

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setArticles(data)
                setLoading(false)
            }
        })()
    }, [])

    return { articles }
}