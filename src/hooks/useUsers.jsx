import { useContext, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"
import { useQuery } from "./useQuery"

import { USER_URL } from "../utils/urls"
import { STATUS_CODES } from "../utils/constants"

export function useUsers() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [users, setUsers] = useState([])
    const [count, setCount] = useState(0)
    const [loadingUsers, setLoadingUsers] = useState(true)
    const [open, setOpen] = useState(null)

    const { handleQuery } = useQuery()

    async function getUsers() {
        const { status, data } = await handleQuery({ url: USER_URL })
        if (status === STATUS_CODES.OK) {
            setUsers(data[0])
            setCount(data[1])
            setLoadingUsers(false)
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
                    setUsers([data, ...users])
                    setCount(prev => prev + 1)
                    setMessage('Usuario creado correctamente.')
                } else {
                    setUsers([data, ...users.filter(u => u.id !== data.id)])
                    setMessage('Usuario editado correctamente.')
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

    async function handleDelete(formData) {
        setLoadingUsers(true)
        const { status, data } = await handleQuery({
            url: `${USER_URL}/${formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setUsers([data, ...users.filter(u => u.id !== data.id)])
            setCount(prev => prev - 1)
            setMessage('Usuario eliminado correctamente.')
            setSeverity('success')
        } else {
            if (status === STATUS_CODES.DATABASE_ERROR) {
                setMessage('El usuario tiene datos asociados.')
            } else {
                setMessage('Ocurrió un error. Actualice la página.')
            }
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingUsers(false)
        setOpen(null)
    }

    return {
        loadingUsers,
        setLoadingUsers,
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        getUsers,
        users,
        count
    }
}