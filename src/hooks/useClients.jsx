import { useContext, useEffect, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { CLIENT_URL } from "../utils/urls"

export function useClients() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingClients, setLoadingClients] = useState(true)
    const [clients, setClients] = useState([])

    const { get } = useApi(CLIENT_URL)

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setClients(data[0])
                setLoadingClients(false)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
        })()
    }, [])

    return { clients, setClients, loadingClients, setLoadingClients }
}