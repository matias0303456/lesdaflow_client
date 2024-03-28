import { createContext, useState } from "react";

export const PageContext = createContext({
    page: null,
    setPage: () => { },
    offset: null,
    setOffset: () => { },
    count: null,
    setCount: () => { }
})

export function PageProvider({ children }) {

    const [page, setPage] = useState({
        'products': 0,
        'payments': 0,
        'incomes': 0,
        'outcomes': 0,
        'sales': 0,
        'registers': 0,
        'clients': 0,
        'suppliers': 0,
        'users': 0
    })
    const [offset, setOffset] = useState({
        'products': 25,
        'payments': 25,
        'incomes': 25,
        'outcomes': 25,
        'sales': 25,
        'registers': 25,
        'clients': 25,
        'suppliers': 25,
        'users': 25
    });
    const [count, setCount] = useState({
        'products': 0,
        'payments': 0,
        'incomes': 0,
        'outcomes': 0,
        'sales': 0,
        'registers': 0,
        'clients': 0,
        'suppliers': 0,
        'users': 0
    })

    return (
        <PageContext.Provider value={{ page, setPage, offset, setOffset, count, setCount }}>
            {children}
        </PageContext.Provider>
    )
}