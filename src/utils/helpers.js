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

export function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

export function getLoansYears(loans) {
    const dates = loans.map(l => new Date(l.date))
    const set = new Set(dates.map(d => d.getFullYear()))
    return Array.from(set).sort((a, b) => b - a)
}

export function getLoansMonths(loans) {
    const dates = loans.map(l => new Date(l.date))
    const set = new Set(dates.map(d => d.getMonth()))
    return Array.from(set).sort((a, b) => a - b)
}

export function getPaymentDates(startDate, paymentsAmount, frequency) {
    const paymentDates = []
    for (let i = 0; i < paymentsAmount; i++) {
        const newDate = new Date(startDate)
        switch (frequency) {
            case 'MENSUAL':
                newDate.setMonth(newDate.getMonth() + i)
                break
            case 'SEMANAL':
                newDate.setDate(newDate.getDate() + i * 7)
                break
            case 'QUINCENAL':
                newDate.setDate(newDate.getDate() + i * 15)
                break
            default:
                throw new Error('Frecuencia de pagos no soportada')
        }
        paymentDates.push(new Date(newDate))
    }
    return paymentDates
}
