import { useContext, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { PAYMENT_URL } from "../utils/urls"

export function usePayments() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingPayments, setLoadingPayments] = useState(true)
    const [payments, setPayments] = useState([])

    const { get } = useApi(PAYMENT_URL)

    async function getPayments() {
        const { status, data } = await get()
        if (status === 200) {
            setPayments(data)
            setLoadingPayments(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    return { payments, setPayments, loadingPayments, setLoadingPayments, getPayments }
}