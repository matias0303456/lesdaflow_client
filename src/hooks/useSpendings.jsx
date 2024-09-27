import { useContext, useState } from "react"

import { useQuery } from "./useQuery"
import { MessageContext } from "../providers/MessageProvider"

import { SPENDING_URL } from "../utils/urls"
import { STATUS_CODES } from "../utils/constants"

export function useSpendings() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { handleQuery } = useQuery()

    const [spendings, setSpendings] = useState([])
    const [count, setCount] = useState(0)
    const [open, setOpen] = useState(null)
    const [loadingSpendings, setLoadingSpendings] = useState(true)
    const [filter, setFilter] = useState({
        page: 0,
        offset: 25
    })

    async function getSpendings(params) {
        const { status, data } = await handleQuery({
            url: `${SPENDING_URL}${params ? params : ''}`
        })
        if (status === STATUS_CODES.OK) {
            setSpendings(data[0])
            setCount(data[1])
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
        setLoadingSpendings(false)
    }

    async function handleSubmit(e, validate, formData, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const urls = { 'NEW': SPENDING_URL, 'EDIT': `${SPENDING_URL}/${formData.id}` }
            const methods = { 'NEW': 'POST', 'EDIT': 'PUT' }
            const { status, data } = await handleQuery({
                url: urls[open],
                method: methods[open],
                body: formData
            })
            if (status === STATUS_CODES.OK || status === STATUS_CODES.CREATED) {
                if (open === 'NEW') {
                    setSpendings([data, ...spendings])
                    setCount(prev => prev + 1)
                    setMessage('Gasto creado correctamente.')
                } else {
                    setSpendings([data, ...spendings.filter(s => s.id !== data.id)])
                    setMessage('Gasto editado correctamente.')
                }
                setSeverity('success')
                reset(setOpen)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        }
    }

    async function handleDelete(formData, reset) {
        setLoadingSpendings(true)
        const { status, data } = await handleQuery({
            url: `${SPENDING_URL}/${formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setSpendings(spendings.filter(s => s.id !== data.id))
            setCount(prev => prev - 1)
            setMessage('Gasto eliminado correctamente.')
            setSeverity('success')
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingSpendings(false)
        reset(setOpen)
    }

    return {
        loadingSpendings,
        setLoadingSpendings,
        handleSubmit,
        handleDelete,
        open,
        setOpen,
        getSpendings,
        spendings,
        count,
        filter,
        setFilter
    }
}