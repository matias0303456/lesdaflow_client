import { useContext } from 'react'

import { LOGIN_URL } from '../utils/urls'
import { AuthContext } from '../contexts/AuthContext'

export function useAuth() {

    const { setAuth } = useContext(AuthContext)

    async function login(user) {
        const res = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        const json = await res.json()
        return { status: res.status, result: json }
    }

    function logout() {
        setAuth(null)
        localStorage.removeItem('auth')
    }

    return { login, logout }
}