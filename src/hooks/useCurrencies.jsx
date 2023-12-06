import { useContext, useEffect, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { CURRENCY_URL } from "../utils/urls"

export function useCurrencies() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingCurrencies, setLoadingCurrencies] = useState(true)
    const [currencies, setCurrencies] = useState([])

    const { get } = useApi(CURRENCY_URL)

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setCurrencies(data)
                setLoadingCurrencies(false)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
        })()
    }, [])

    return { currencies, setCurrencies, loadingCurrencies, setLoadingCurrencies }
}