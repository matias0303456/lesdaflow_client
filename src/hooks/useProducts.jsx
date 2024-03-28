import { useContext, useEffect, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"
import { PageContext } from "../providers/PageProvider"

import { PRODUCT_URL } from "../utils/urls"

export function useProducts() {

    const { page, offset, count, setCount } = useContext(PageContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingProducts, setLoadingProducts] = useState(true)
    const [products, setProducts] = useState([])

    const { get } = useApi(PRODUCT_URL)

    useEffect(() => {
        (async () => {
            await getProducts()
        })()
    }, [])

    async function getProducts() {
        const { status, data } = await get(page['products'], offset['products'])
        if (status === 200) {
            setProducts(data[0])
            setCount({ ...count, 'products': data[1] })
            setLoadingProducts(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    return { products, setProducts, loadingProducts, setLoadingProducts, getProducts }
}