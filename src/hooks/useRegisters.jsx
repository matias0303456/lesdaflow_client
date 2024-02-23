import { useContext, useEffect, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { REGISTER_URL } from "../utils/urls"

export function useRegisters() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingRegisters, setLoadingRegisters] = useState(true)
    const [registers, setRegisters] = useState([])

    const { get } = useApi(REGISTER_URL)

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setRegisters(data)
                setLoadingRegisters(false)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setOpenMessage(true)
            }
        })()
    }, [])

    return { registers, setRegisters, loadingRegisters, setLoadingRegisters }
}