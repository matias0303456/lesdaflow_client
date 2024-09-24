export function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

export function getLoansYears(loansWithPaymentDates) {
    const dates = loansWithPaymentDates.map(l => new Date(l.date))
    const set = new Set(dates.map(d => d.getFullYear()))
    return Array.from(set).sort((a, b) => b - a)
}

export function getLoansMonths(loansWithPaymentDates) {
    const dates = loansWithPaymentDates.map(l => new Date(l.date))
    const set = new Set(dates.map(d => d.getMonth()))
    return Array.from(set).sort((a, b) => a - b)
}

export function getPaymentDates(startDate, paymentsAmount, frequency) {
    const paymentDates = []
    for (let i = 1; i <= paymentsAmount; i++) {
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
        paymentDates.push(new Date(newDate).toISOString().split('T')[0])
    }
    return paymentDates
}

export function filterRowsByMonthAndYear(loansWithPaymentDates, year, month) {
    return loansWithPaymentDates.filter(l =>
        new Date(l.date).getFullYear() === year &&
        new Date(l.date).getMonth() === month)
}

export function getLoanTotal(loan) {
    return parseFloat(loan.amount + ((loan.amount / 100) * loan.interest)).toFixed(2)
}

export function getPaymentAmount(loan) {
    const total = parseFloat(getLoanTotal(loan))
    return parseFloat(total / loan.payments_amount).toFixed(2)
}

export function getPaymentAmountWithLateFee(workOn, formData) {
    const { loan, payment } = workOn
    const paymentAmount = parseFloat(getPaymentAmount(loan))
    const start = new Date(payment)
    const end = new Date(formData.date)
    if (end < start) return paymentAmount.toFixed(2)
    const diffMillisecs = end - start
    const diff = diffMillisecs / (1000 * 60 * 60 * 24)
    const diffDays = Math.abs(Math.round(diff))
    const iterable = Array.from({ length: diffDays })
    const totalLateFee = iterable.reduce(day => day + ((paymentAmount / 100) * loan.late_fee), 0)
    return parseFloat(paymentAmount + totalLateFee).toFixed(2)
}

export function getLoansTotalInterest(loans) {
    return loans.reduce((prev, curr) => prev + (parseFloat(getLoanTotal(curr)) - curr.amount), 0).toFixed(2)
}

export function getLoansPaidInterest(loans) {
    return loans.reduce((prev, curr) => {
        const loanTotalInterest = parseFloat(getLoanTotal(curr)) - curr.amount
        return prev + ((loanTotalInterest / curr.payments_amount) * curr.payments.length)
    }, 0).toFixed(2)
}

export function getLoansPendingInterest(loans) {
    const totalInterest = parseFloat(getLoansTotalInterest(loans))
    const paidInterest = parseFloat(getLoansPaidInterest(loans))
    return parseFloat(totalInterest - paidInterest).toFixed(2)
}