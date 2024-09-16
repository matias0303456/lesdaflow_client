import { useContext, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"
import { DataContext } from "../providers/DataProvider"
import { useApi } from "./useQuery"

import { USER_URL } from "../utils/urls"

export function useUsers() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const [loadingUsers, setLoadingUsers] = useState(true)
    const [open, setOpen] = useState(null)
    const [newPwd, setNewPwd] = useState('')

    const { get, post, put, destroy } = useApi(USER_URL)

    async function getUsers(params) {
        const { status, data } = await get(params)
        if (status === 200) {
            dispatch({
                type: 'USERS',
                payload: { ...state.users, data: data[0], count: data[1] }
            })
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
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    dispatch({ type: 'USERS', payload: { ...state.users, data: [data, ...state.users.data] } })
                    setMessage('Usuario creado correctamente.')
                } else {
                    dispatch({
                        type: 'USERS',
                        payload: {
                            ...state.users,
                            data: [
                                data,
                                ...state.users.data.filter(u => u.id !== formData.id)
                            ]
                        }
                    })
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
        const { status, data } = await destroy(formData)
        if (status === 200) {
            dispatch({
                type: 'USERS',
                payload: {
                    ...state.users,
                    data: [...state.users.data.filter(u => u.id !== data.id)]
                }
            })
            setMessage('Usuario eliminado correctamente.')
            setSeverity('success')
        } else {
            if (status === 300) {
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

    async function toggleActive(formData) {
        const { status, data } = await put(formData)
        if (status === 200) {
            dispatch({
                type: 'USERS',
                payload: {
                    ...state.users,
                    data: [
                        data,
                        ...state.users.data.filter(u => u.id !== formData.id)
                    ]
                }
            })
            setMessage('Usuario editado correctamente.')
            setSeverity('success')
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
    }

    return {
        loadingUsers,
        setLoadingUsers,
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        getUsers,
        newPwd, 
        setNewPwd,
        toggleActive
    }
}