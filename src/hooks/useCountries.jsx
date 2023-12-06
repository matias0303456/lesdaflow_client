import { useContext, useEffect, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { COUNTRY_URL } from "../utils/urls"

export function useCountries() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingCountries, setLoadingCountries] = useState(true)
    const [countries, setCountries] = useState([])

    const { get } = useApi(COUNTRY_URL)

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setCountries(data)
                setLoadingCountries(false)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
        })()
    }, [])

    return { countries, setCountries, loadingCountries, setLoadingCountries }
}