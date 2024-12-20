import { PAYMENT_FREQUENCIES, PAYMENT_FREQUENCIES_COLORS } from "./constants"

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
    return Array.from(set).sort((a, b) => b - a)
}

export function filterRowsByMonthAndYear(loans, year, month) {
    return loans.filter(l =>
        new Date(l.date).getFullYear() === year &&
        new Date(l.date).getMonth() === month)
}

export function getLoanTotal(loan) {
    const amount = loan.amount ?? 0
    const interest = loan.interest ?? 0
    const result = parseFloat(amount + ((amount / 100) * interest)).toFixed(2)
    return isNaN(result) ? 0 : result
}

export function getPaymentAmount(loan) {
    const total = parseFloat(getLoanTotal(loan))
    const result = parseFloat(total / loan.payments_amount).toFixed(2)
    return isNaN(result) ? 0 : result
}

export function getPaymentAmountWithLateFee(workOn, formData) {
    const { loan, payment } = workOn
    const paymentAmount = parseFloat(getPaymentAmount(loan))
    const start = new Date(payment + 'T00:00:00')
    const end = new Date(formData.date)
    if (end < start) return paymentAmount.toFixed(2)
    const diffMillisecs = end - start
    const diff = diffMillisecs / (1000 * 60 * 60 * 24)
    const diffDays = Math.abs(Math.round(diff)) - loan.no_late_fee_days
    if (diffDays < 0 || (loan.late_fee_type === 'NOMINAL' && diffDays === 0)) return paymentAmount.toFixed(2)
    if (loan.late_fee_type === 'NOMINAL') return (paymentAmount + (diffDays * loan.late_fee)).toFixed(2)
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

export function setLocalDate(loan) {
    const localDate = new Date(loan.date);
    localDate.setHours(localDate.getHours() + localDate.getTimezoneOffset() / 60);
    return localDate;
}

export function setPfColor(frequency) {
    return PAYMENT_FREQUENCIES_COLORS[PAYMENT_FREQUENCIES.indexOf(frequency)]
}

export function loanIsPending(loan) {
    return loan.payments.length < loan.payment_dates.length
}

export function clientHasPendingLoans(id, loans) {
    if (!id || id.toString().length === 0) return false
    return loans.some(loan => loan.client_id === parseInt(id) && loanIsPending(loan))
}