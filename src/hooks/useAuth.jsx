import { LOGIN_URL } from '../utils/urls'

export function useAuth() {

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

    return { login }
}