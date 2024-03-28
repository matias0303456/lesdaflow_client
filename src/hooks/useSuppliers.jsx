import { useContext, useEffect, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"
import { PageContext } from "../providers/PageProvider"
import { useApi } from "./useApi"

import { SUPPLIER_URL } from "../utils/urls"

export function useSuppliers() {

    const { page, offset, count, setCount, search } = useContext(PageContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingSuppliers, setLoadingSuppliers] = useState(true)
    const [suppliers, setSuppliers] = useState([])

    const { get } = useApi(SUPPLIER_URL)

    useEffect(() => {
        (async () => {
            await getSuppliers()
        })()
    }, [])

    async function getSuppliers() {
        const { status, data } = await get(page['suppliers'], offset['suppliers'], search)
        if (status === 200) {
            setSuppliers(data[0])
            setCount({ ...count, 'suppliers': data[1] })
            setLoadingSuppliers(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    return { suppliers, setSuppliers, loadingSuppliers, setLoadingSuppliers, getSuppliers }
}