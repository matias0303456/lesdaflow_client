import { useContext, useEffect, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { PRODUCT_URL } from "../utils/urls"

export function useProducts() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingProducts, setLoadingProducts] = useState(true)
    const [products, setProducts] = useState([])

    const { get } = useApi(PRODUCT_URL)

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setProducts(data)
                setLoadingProducts(false)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
        })()
    }, [])

    return { products, setProducts, loadingProducts, setLoadingProducts }
}