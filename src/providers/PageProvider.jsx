import { createContext, useState } from "react";

export const PageContext = createContext({
    page: null,
    setPage: () => { },
    rowsPerPage: null,
    setRowsPerPage: () => { }
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
    const [rowsPerPage, setRowsPerPage] = useState({
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

    return (
        <PageContext.Provider value={{ page, setPage, rowsPerPage, setRowsPerPage }}>
            {children}
        </PageContext.Provider>
    )
}