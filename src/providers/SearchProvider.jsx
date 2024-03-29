import { createContext, useState } from "react";

export const SearchContext = createContext({
    searchClients: [],
    setSearchClients: () => { },
    searchProducts: [],
    setSearchProducts: () => { }
})

export function SearchProvider({ children }) {

    const [searchClients, setSearchClients] = useState([])
    const [searchProducts, setSearchProducts] = useState([])

    return (
        <SearchContext.Provider value={{
            searchClients,
            setSearchClients,
            searchProducts,
            setSearchProducts
        }}>
            {children}
        </SearchContext.Provider>
    )
}