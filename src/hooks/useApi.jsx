import { useContext } from "react"

import { AuthContext } from "../contexts/AuthContext"

export function useApi(url) {

    const { auth } = useContext(AuthContext)

    async function get() {
        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth.token
                }
            })
            const json = await res.json()
            return { status: res.status, data: json }
        } catch (err) {
            console.log(err)
        }
    }

    async function post(req) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth.token
                },
                body: JSON.stringify(req)
            })
            const json = await res.json()
            return { status: res.status, data: json }
        } catch (err) {
            console.log(err)
        }
    }

    async function put(req) {
        try {
            const res = await fetch(url + `/${req.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth.token
                },
                body: JSON.stringify(req)
            })
            const json = await res.json()
            return { status: res.status, data: json }
        } catch (err) {
            console.log(err)
        }
    }

    async function destroy(req) {
        try {
            const res = await fetch(url + `/${req.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth.token
                }
            })
            const json = await res.json()
            return { status: res.status, data: json }
        } catch (err) {
            console.log(err)
        }
    }

    return {
        get,
        post,
        put,
        destroy
    }
}