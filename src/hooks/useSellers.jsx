import { useContext, useEffect, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { SELLER_URL } from "../utils/urls"

export function useSellers() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingSellers, setLoadingSellers] = useState(true)
    const [sellers, setSellers] = useState([])

    const { get } = useApi(SELLER_URL)

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setSellers(data[0])
                setLoadingSellers(false)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
        })()
    }, [])

    return { sellers, setSellers, loadingSellers, setLoadingSellers }
}