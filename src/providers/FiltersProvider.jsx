/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";
import { filtersInitialState } from "../utils/filtersInitialState";

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
        case 'DISCOUNTS':
            return { ...state, discounts: action.payload }
        case 'RESET':
            return filtersInitialState;
        default:
            return state;
    }
}

export const FiltersContext = createContext({
    state: filtersInitialState,
    dispatch: () => { }
});

export function FiltersProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, filtersInitialState);

    const resetContext = () => {
        dispatch({ type: 'RESET' });
    };

    return (
        <FiltersContext.Provider value={{ state, dispatch, resetContext }}>
            {children}
        </FiltersContext.Provider>
    );
}
