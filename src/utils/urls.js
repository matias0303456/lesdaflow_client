const BASE_URL = import.meta.env.VITE_APP_BASE_URL

export const LOGIN_URL = `${BASE_URL}/auth/login`
export const ROLE_URL = `${BASE_URL}/roles`
export const INCOME_URL = `${BASE_URL}/incomes`
export const OUTCOME_URL = `${BASE_URL}/outcomes`
export const SALE_URL = `${BASE_URL}/sales`
export const PRODUCT_URL = `${BASE_URL}/products`
export const CLIENT_URL = `${BASE_URL}/clients`
export const SUPPLIER_URL = `${BASE_URL}/suppliers`
export const USER_URL = `${BASE_URL}/users`
export const CHANGE_PASSWORD_URL = `${USER_URL}/change-password`
export const REPORT_URL = `${BASE_URL}/reports`
export const PAYMENT_URL = `${BASE_URL}/payments`
export const REGISTER_URL = `${BASE_URL}/registers`