import { PAYMENT_FREQUENCIES } from "./constants"

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
    return Array.from(set).sort((a, b) => b - a)
}

export function getPaymentDates(loan, frequency) {
    if (frequency === PAYMENT_FREQUENCIES[3]) {
        return loan.free_loan_payment_dates.map(d => new Date(d.date).toISOString().split('T')[0])
    }
    const paymentDates = []
    for (let i = 1; i <= loan.payments_amount; i++) {
        const newDate = setLocalDate(loan)
        // esto lo hice para no tener que modificar las fechas de los pagos ya cargados
        const legacy = [40, 42, 43, 44, 45, 46, 47, 48, 50]
        switch (frequency) {
            case PAYMENT_FREQUENCIES[0]:
                if (loan.id < 39 || (loan.id > 39 && legacy.includes(loan.id))) {
                    newDate.setMonth(newDate.getMonth() + i)
                } else {
                    newDate.setDate(newDate.getDate() + i * 30)
                }
                break
            case PAYMENT_FREQUENCIES[1]:
                newDate.setDate(newDate.getDate() + i * 15)
                break
            case PAYMENT_FREQUENCIES[2]:
                newDate.setDate(newDate.getDate() + i * 7)
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

export function getLoansTotalInterestWithSpendings(total, includeSpendings, spendings) {
    if (!includeSpendings) return total
    const totalSpendings = spendings.reduce((prev, curr) => prev + curr.amount, 0)
    return parseFloat(total - totalSpendings).toFixed(2)
}

export function setLocalDate(loan) {
    const localDate = new Date(loan.date);
    localDate.setHours(localDate.getHours() + localDate.getTimezoneOffset() / 60);
    return localDate;
}