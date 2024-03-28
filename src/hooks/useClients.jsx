import { useContext, useEffect, useState } from "react"

import { PageContext } from "../providers/PageProvider"
import { MessageContext } from "../providers/MessageProvider"
import { useApi } from "./useApi"

import { CLIENT_URL } from "../utils/urls"

export function useClients() {

    const { page, offset, count, setCount, search } = useContext(PageContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingClients, setLoadingClients] = useState(true)
    const [clients, setClients] = useState([])

    const { get } = useApi(CLIENT_URL)

    useEffect(() => {
        (async () => {
            await getClients()
        })()
    }, [])

    async function getClients() {
        const { status, data } = await get(page['clients'], offset['clients'], search)
        if (status === 200) {
            setClients(data[0])
            setCount({ ...count, 'clients': data[1] })
            setLoadingClients(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    return { clients, setClients, loadingClients, setLoadingClients, getClients }
}