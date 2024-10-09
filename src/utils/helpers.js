export function getStock(product) {
    if (!product) return
    return product.incomes?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0) - product.sale_products?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0) - product.outcomes?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0)
}

export function getCurrentSubtotal(saleProducts, products) {
    const total = saleProducts.reduce((prev, curr) => {
        const p = products.find(item => item.id === curr.product_id)
        return prev + (((curr.buy_price ?? p.buy_price) + (((curr.buy_price ?? p.buy_price) / 100) * (curr.earn ?? p.earn))) * (isNaN(parseInt(curr.amount)) ? 0 : parseInt(curr.amount)))
    }, 0)
    return total.toFixed(2)
}

export function getCurrentTotal(formData, saleProducts, products) {
    const subtotal = getCurrentSubtotal(saleProducts, products)
    const discount = formData.discount.length === 0 ? 0 : parseInt(formData.discount)
    return (subtotal - ((subtotal / 100) * discount)).toFixed(2)
}

export function getSaleSubtotal(sale) {
    const result = sale.sale_products.reduce((prev, curr) => prev + ((curr.buy_price + ((curr.buy_price / 100) * curr.earn)) * curr.amount), 0)
    return `$${result.toFixed(2)}`
}

export function getSaleTotal(sale) {
    const subtotal = getSaleSubtotal(sale).replace('$', '')
    return `$${(subtotal - ((subtotal / 100) * sale.discount)).toFixed(2)}`
}

export function getSaleDifference(sale) {
    if (!sale.sale_products) return 0
    const saleTotal = getSaleTotal(sale).replaceAll('$', '')
    const paymentsTotal = sale.payments.reduce((prev, curr) => prev + curr.amount, 0)
    return `$${(saleTotal - paymentsTotal).toFixed(2)}`
}

export function getDeadline(date) {
    const startDate = new Date(date)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 20)
    return endDate.toISOString().split('T')[0]
}

export function deadlineIsPast(row) {
    if (row.type !== 'CUENTA_CORRIENTE') return false
    const now = new Date(Date.now())
    const deadline = new Date(getDeadline(row.date))
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

export function getNewPrice(product, percentage) {
    const price = parseFloat((product.buy_price + ((product.buy_price / 100) * product.earn)).toFixed(2))
    const perc = percentage.toString().length === 0 ? 0 : parseFloat(percentage)
    return (price + ((price / 100) * perc)).toFixed(2)
}

export function getNewCostAndEarnPrice(product, value, earn) {
    if (parseFloat(earn) === 0 && parseFloat(value) === 0) {
        return (product.buy_price + (product.buy_price / 100) * product.earn).toFixed(2)
    }
    if (parseFloat(value) === 0) {
        return (product.buy_price + (product.buy_price / 100) * parseFloat(earn)).toFixed(2)
    }
    if (parseFloat(earn) === 0) {
        return (parseFloat(value) + (parseFloat(value) / 100) * product.earn).toFixed(2)
    }
    return (parseFloat(value) + (parseFloat(value) / 100) * parseFloat(earn)).toFixed(2)
}

export function getAccountStatus(sale) {
    if (sale.type === 'CONTADO') return ''
    const diff = getSaleDifference(sale).replaceAll('$', '')
    if (diff > 0) {
        return 'Pendiente'
    } else {
        return 'Finalizada'
    }
}

export function getSaleDifferenceByPayment(sale, idx) {
    const total = getSaleTotal(sale).replace('$', '')
    const payments = sale.payments.sort((a, b) => a.id - b.id)
    const totalTillPayment = payments.filter((_, index) => index <= idx).reduce((prev, curr) => prev + curr.amount, 0)
    return `$${(total - totalTillPayment).toFixed(2)}`
}

export function getStockTillDate(row) {
    return row.product.incomes?.filter(inc => inc.created_at < row.created_at)
        .reduce((prev, curr) => {
            return prev + curr.amount
        }, 0) - row.product.sale_products?.filter(sp => sp.created_at < row.created_at)
            .reduce((prev, curr) => {
                return prev + curr.amount
            }, 0) - row.product.outcomes?.filter(out => out.created_at < row.created_at)
                .reduce((prev, curr) => {
                    return prev + curr.amount
                }, 0)
}

export function getProductSalePrice(product) {
    return parseFloat(parseFloat(product.buy_price) + ((parseFloat(product.buy_price) / 100) * parseFloat(product.earn)))
}

export function getProductNewSalePriceByPercentage(product, percentage) {
    const perc = percentage.toString().length === 0 ? 0 : parseFloat(percentage)
    const currentPrice = getProductSalePrice(product)
    return currentPrice + ((currentPrice / 100) * perc)
}

export function getBudgetSubtotal(budget_products) {
    const totalBudgetProducts = budget_products.reduce((prev, curr) => prev + (getProductSalePrice(curr.product) * curr.amount), 0)
    return totalBudgetProducts.toFixed(2)
}

export function getBudgetTotal(budget, subtotal) {
    return (subtotal - ((subtotal / 100) * parseFloat(budget.discount))).toFixed(2)
}

export function saleIsPrepared(sale) {
    return sale.sale_products.every(sp => sp.is_prepared)
}

export function getDeliveredDeadline(sale) {
    if (!sale.delivered_at) return new Date(Date.now())
    const delivered = new Date(sale.delivered_at)
    delivered.setDate(delivered.getDate() + 20)
    return delivered
}