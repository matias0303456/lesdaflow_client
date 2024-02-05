export function getStock(product) {
    if (!product) return
    return product.incomes?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0) - product.sale_products?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0)
}

export function getCurrentSubtotal(saleProducts, products) {
    const total = saleProducts.reduce((prev, curr) => {
        const p = products.find(item => item.id === curr.product_id)
        return prev + (p.buy_price * (isNaN(parseInt(curr.amount)) ? 0 : parseInt(curr.amount)))
    }, 0)
    return total.toFixed(2)
}

export function getCurrentTotal(formData, saleProducts, products) {
    const total = saleProducts.reduce((prev, curr) => {
        const p = products.find(item => item.id === curr.product_id)
        return prev + (p.buy_price * (isNaN(parseInt(curr.amount)) ? 0 : parseInt(curr.amount)))
    }, 0)
    const discount = formData.discount.length === 0 ? 0 : parseInt(formData.discount)
    return (total - ((total / 100) * discount)).toFixed(2) 
}

export function getSaleTotal(sale) {
    const totalSaleProducts = sale.sale_products.reduce((prev, curr) => prev + (curr.product.buy_price * curr.amount), 0)
    return `$${(totalSaleProducts - ((totalSaleProducts / 100) * sale.discount)).toFixed(2)}`
}

export function getSaleDifference(sale) {
    const saleTotal = getSaleTotal(sale).replaceAll('$', '')
    const paymentsTotal = sale.payments.reduce((prev, curr) => prev + curr.amount, 0)
    return `$${(saleTotal - paymentsTotal).toFixed(2)}`
}

export function getDeadline(date, installments) {
    const startDate = new Date(date)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 30 * installments)
    return endDate.toISOString().split('T')[0]
}

export function deadlineIsPast(row) {
    const now = new Date(Date.now())
    const deadline = new Date(getDeadline(row.date, row.installments))
    return deadline < now
}

export function setLocalDate(date) {
    const original = new Date(date)
    let newDate = new Date(original)
    return newDate
}

export function setFromDate(date) {
    const newDate = new Date(date)
    newDate.setHours(0, 0, 0, 0)
    return newDate
}

export function setToDate(date) {
    const newDate = new Date(date)
    newDate.setHours(23, 59, 59, 999)
    return newDate
}
