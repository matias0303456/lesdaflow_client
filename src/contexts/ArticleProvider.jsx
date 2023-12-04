import { createContext, useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { ARTICLE_URL } from "../utils/urls";

export const ArticleContext = createContext({
    loading: false,
    setLoading: () => { },
    articles: [],
    setArticles: () => { }
})

export function ArticleProvider({ children }) {

    const { get } = useApi(ARTICLE_URL)

    const [loading, setLoading] = useState(true)
    const [articles, setArticles] = useState([])

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setArticles(data)
                setLoading(false)
            }
        })()
    }, [])

    return (
        <ArticleContext.Provider value={{ loading, setLoading, articles, setArticles }}>
            {children}
        </ArticleContext.Provider>
    )
}