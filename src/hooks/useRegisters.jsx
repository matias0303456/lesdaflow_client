import { useContext, useEffect, useState } from "react"

import { PageContext } from "../providers/PageProvider"
import { MessageContext } from "../providers/MessageProvider"
import { useApi } from "./useApi"

import { REGISTER_URL } from "../utils/urls"

export function useRegisters() {

    const { page, offset, count, setCount } = useContext(PageContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingRegisters, setLoadingRegisters] = useState(true)
    const [registers, setRegisters] = useState([])

    const { get } = useApi(REGISTER_URL)

    useEffect(() => {
        (async () => {
            await getRegisters()
        })()
    }, [])

    async function getRegisters() {
        const { status, data } = await get(page['registers'], offset['registers'])
        if (status === 200) {
            setRegisters(data[0])
            setCount({ ...count, 'registers': data[1] })
            setLoadingRegisters(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    return { registers, setRegisters, loadingRegisters, setLoadingRegisters, getRegisters }
}