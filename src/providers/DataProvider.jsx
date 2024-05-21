import { createContext, useReducer } from "react";

const reducer = (state, action) => {
    switch (action.type) {
        case 'CLIENTS':
            return { ...state, clients: action.payload }
        case 'PRODUCTS':
            return { ...state, products: action.payload }
        case 'SALES':
            return { ...state, sales: action.payload }
        case 'USERS':
            return { ...state, users: action.payload }
        case 'SELLERS':
            return { ...state, sellers: action.payload }
        case 'REGISTERS':
            return { ...state, registers: action.payload }
        case 'SUPPLIERS':
            return { ...state, suppliers: action.payload }
        default:
            return state
    }
}

const initialState = {
    'clients': {
        count: 0,
        setCount: () => { },
        data: [],
        setData: () => { },
        page: 0,
        setPage: () => { },
        offset: 5,
        setOffset: () => { }
    },
    'products': {
        count: 0,
        setCount: () => { },
        data: [],
        setData: () => { },
        page: 0,
        setPage: () => { },
        offset: 5,
        setOffset: () => { }
    },
    'sales': {
        count: 0,
        setCount: () => { },
        data: [],
        setData: () => { },
        page: 0,
        setPage: () => { },
        offset: 5,
        setOffset: () => { }
    },
    'users': {
        count: 0,
        setCount: () => { },
        data: [],
        setData: () => { },
        page: 0,
        setPage: () => { },
        offset: 5,
        setOffset: () => { }
    },
    'sellers': {
        count: 0,
        setCount: () => { },
        data: [],
        setData: () => { },
        page: 0,
        setPage: () => { },
        offset: 5,
        setOffset: () => { }
    },
    'registers': {
        count: 0,
        setCount: () => { },
        data: [],
        setData: () => { },
        page: 0,
        setPage: () => { },
        offset: 5,
        setOffset: () => { }
    },
    'suppliers': {
        count: 0,
        setCount: () => { },
        data: [],
        setData: () => { },
        page: 0,
        setPage: () => { },
        offset: 5,
        setOffset: () => { }
    }
}

export const DataContext = createContext({
    state: initialState,
    dispatch: () => { }
})

export function DataProvider({ children }) {

    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <DataContext.Provider value={{ state, dispatch }}>
            {children}
        </DataContext.Provider>
    )
}