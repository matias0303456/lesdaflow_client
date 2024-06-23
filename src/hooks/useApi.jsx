import { useContext } from "react"

import { AuthContext } from "../providers/AuthProvider"
import { MessageContext } from "../providers/MessageProvider"

export function useApi(url) {

    const { auth } = useContext(AuthContext)
    const { setOpenMessage, setSeverity, setMessage } = useContext(MessageContext)

    async function get(params) {
        try {
            const res = await fetch(url + (params ? params : ''), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth?.token
                }
            })
            const json = await res.json()
            return { status: res.status, data: json }
        } catch (err) {
            setMessage('Ocurrió un error.')
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function getById(id) {
        try {
            const res = await fetch(url + `/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth?.token
                }
            })
            const json = await res.json()
            return { status: res.status, data: json }
        } catch (err) {
            setMessage('Ocurrió un error.')
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function post(req, publicUrl = false) {
        let headers = { 'Content-Type': 'application/json' }
        if (!publicUrl) headers = { ...headers, 'Authorization': auth?.token }
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(req)
            })
            const json = await res.json()
            return { status: res.status, data: json }
        } catch (err) {
            setMessage('Ocurrió un error.')
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function put(req, params) {
        try {
            const res = await fetch(url + (params ? params : '') + `/${req.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth?.token
                },
                body: JSON.stringify(req)
            })
            const json = await res.json()
            return { status: res.status, data: json }
        } catch (err) {
            setMessage('Ocurrió un error.')
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function putMassive(req) {
        try {
            const res = await fetch(url + '/massive-edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth?.token
                },
                body: JSON.stringify(req)
            })
            const json = await res.json()
            return { status: res.status, data: json }
        } catch (err) {
            setMessage('Ocurrió un error.')
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function destroy(req) {
        try {
            const res = await fetch(url + `/${req.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth?.token
                }
            })
            const json = await res.json()
            return { status: res.status, data: json }
        } catch (err) {
            setMessage('Ocurrió un error.')
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    return { get, post, put, putMassive, destroy, getById }
}