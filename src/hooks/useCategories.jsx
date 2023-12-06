import { useContext, useEffect, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { CATEGORY_URL } from "../utils/urls"

export function useCategories() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingCategories, setLoadingCategories] = useState(true)
    const [categories, setCategories] = useState([])

    const { get } = useApi(CATEGORY_URL)

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setCategories(data)
                setLoadingCategories(false)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
        })()
    }, [])

    return { categories, setCategories, loadingCategories, setLoadingCategories }
}