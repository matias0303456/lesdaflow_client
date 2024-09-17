import { useContext, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"
import { useQuery } from "./useQuery"

import { USER_URL } from "../utils/urls"
import { STATUS_CODES } from "../utils/constants"

export function useUsers() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [user, setUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true)
    const [open, setOpen] = useState(null)

    const { handleQuery } = useQuery()

    async function getUser() {
        const { status, data } = await handleQuery({ url: USER_URL })
        if (status === STATUS_CODES.OK) {
            setUser(data)
            setLoadingUser(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function handleSubmit(e, validate, formData, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const urls = { 'NEW': USER_URL, 'EDIT': `${USER_URL}/${formData.id}` }
            const methods = { 'NEW': 'POST', 'EDIT': 'PUT' }
            const { status, data } = await handleQuery({
                url: urls[open],
                method: methods[open],
                body: formData
            })
            if (status === STATUS_CODES.CREATED || status === STATUS_CODES.OK) {
                if (open === 'NEW') {
                    setMessage('Usuario creado correctamente.')
                } else {
                    setMessage('Usuario editado correctamente.')
                }
                setUser(data)
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

    return {
        loadingUser,
        setLoadingUser,
        open,
        setOpen,
        handleSubmit,
        getUser,
        user
    }
}