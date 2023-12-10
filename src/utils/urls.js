const BASE_URL = import.meta.env.VITE_APP_BASE_URL

export const LOGIN_URL = `${BASE_URL}/auth/login`
export const ROLE_URL = `${BASE_URL}/roles`
export const CURRENCY_URL = `${BASE_URL}/currencies`
export const COUNTRY_URL = `${BASE_URL}/countries`
export const INCOME_URL = `${BASE_URL}/incomes`
export const OUTCOME_URL = `${BASE_URL}/outcomes`
export const ARTICLE_URL = `${BASE_URL}/articles`
export const CLIENT_URL = `${BASE_URL}/clients`
export const SUPPLIER_URL = `${BASE_URL}/suppliers`
export const CATEGORY_URL = `${BASE_URL}/categories`
export const USER_URL = `${BASE_URL}/users`
export const CHANGE_PASSWORD_URL = `${USER_URL}/change-password`
export const REPORT_URL = `${BASE_URL}/reports`