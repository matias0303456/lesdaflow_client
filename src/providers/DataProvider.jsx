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
        data: [],
        page: 0,
        offset: 5
    },
    'products': {
        count: 0,
        data: [],
        page: 0,
        offset: 5
    },
    'sales': {
        count: 0,
        data: [],
        page: 0,
        offset: 5
    },
    'users': {
        count: 0,
        data: [],
        page: 0,
        offset: 5
    },
    'registers': {
        count: 0,
        data: [],
        page: 0,
        offset: 5
    },
    'suppliers': {
        count: 0,
        data: [],
        page: 0,
        offset: 5
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