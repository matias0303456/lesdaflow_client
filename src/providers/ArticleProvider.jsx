import { createContext, useState } from "react";

export const ArticleContext = createContext({
    loading: false,
    setLoading: () => { },
    articles: [],
    setArticles: () => { }
})

export function ArticleProvider({ children }) {

    const [loading, setLoading] = useState(true)
    const [articles, setArticles] = useState([])

    return (
        <ArticleContext.Provider value={{ loading, setLoading, articles, setArticles }}>
            {children}
        </ArticleContext.Provider>
    )
}