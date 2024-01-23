export function getStock(product) {
    if (!product) return
    return product.incomes?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0) - product.sales?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0)
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
