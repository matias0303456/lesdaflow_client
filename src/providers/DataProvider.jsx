// src/context/DataContext.js

import { createContext, useReducer } from "react";
import { initialState } from "../utils/initialState";

const reducer = (state, action) => {
    switch (action.type) {
        case 'CLIENTS':
            return { ...state, clients: action.payload }
        case 'PRODUCTS':
            return { ...state, products: action.payload }
        case 'SALES':
            return { ...state, sales: action.payload }
        case 'PAYMENTS':
            return { ...state, payments: action.payload }
        case 'USERS':
            return { ...state, users: action.payload }
        case 'REGISTERS':
            return { ...state, registers: action.payload }
        case 'SUPPLIERS':
            return { ...state, suppliers: action.payload }
        case 'BUDGETS':
            return { ...state, budgets: action.payload }
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

export const DataContext = createContext({
    state: initialState,
    dispatch: () => { }
});

export function DataProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const resetContext = () => {
        dispatch({ type: 'RESET' });
    };

    return (
        <DataContext.Provider value={{ state, dispatch, resetContext }}>
            {children}
        </DataContext.Provider>
    );
}
