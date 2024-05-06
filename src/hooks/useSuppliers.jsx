import { useContext, useEffect, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { SUPPLIER_URL } from "../utils/urls"

export function useSuppliers() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingSuppliers, setLoadingSuppliers] = useState(true)
    const [suppliers, setSuppliers] = useState([])

    const { get } = useApi(SUPPLIER_URL)

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setSuppliers(data[0])
                setLoadingSuppliers(false)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
        })()
    }, [])

    return { suppliers, setSuppliers, loadingSuppliers, setLoadingSuppliers }
}