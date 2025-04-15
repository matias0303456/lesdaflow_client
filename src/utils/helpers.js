export function getStock(article) {
    if (!article) return 0
    return article.incomes?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0) - article.sale_articles?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0) - article.outcomes?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0)
}

export function getSaleSubtotal(sale) {
    const result = sale.sale_articles.reduce((prev, curr) => prev + ((curr.buy_price + ((curr.buy_price / 100) * curr.earn)) * curr.amount), 0)
    return `$${result.toFixed(2)}`
}

export function getSaleTotal(sale) {
    if (sale.total !== null) return `$${sale.total.toFixed(2)}`
    const subtotal = getSaleSubtotal(sale).replace('$', '')
    return `$${(subtotal - ((subtotal / 100) * sale.discount)).toFixed(2)}`
}

export function getSaleDifference(sale) {
    if (!sale.sale_articles) return 0
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

export function getNewPrice(article, percentage) {
    const price = parseFloat((article.buy_price + ((article.buy_price / 100) * article.earn)).toFixed(2))
    const perc = percentage.toString().length === 0 ? 0 : parseFloat(percentage)
    return (price + ((price / 100) * perc)).toFixed(2)
}

export function getNewCostAndEarnPrice(article, value, earn) {
    if (parseFloat(earn) === 0 && parseFloat(value) === 0) {
        return (article.buy_price + (article.buy_price / 100) * article.earn).toFixed(2)
    }
    if (parseFloat(value) === 0) {
        return (article.buy_price + (article.buy_price / 100) * parseFloat(earn)).toFixed(2)
    }
    if (parseFloat(earn) === 0) {
        return (parseFloat(value) + (parseFloat(value) / 100) * article.earn).toFixed(2)
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
    return row.article.incomes?.filter(inc => inc.created_at < row.created_at)
        .reduce((prev, curr) => {
            return prev + curr.amount
        }, 0) - row.article.sale_articles?.filter(sa => sa.created_at < row.created_at)
            .reduce((prev, curr) => {
                return prev + curr.amount
            }, 0) - row.article.outcomes?.filter(out => out.created_at < row.created_at)
                .reduce((prev, curr) => {
                    return prev + curr.amount
                }, 0)
}

export function getArticleSalePrice(article) {
    return parseFloat(parseFloat(article.buy_price) + ((parseFloat(article.buy_price) / 100) * parseFloat(article.earn)))
}

export function getArticleNewBuyPriceByPercentage(article, percentage) {
    const perc = percentage.toString().length === 0 ? 0 : parseFloat(percentage)
    return article.buy_price + ((article.buy_price / 100) * perc)
}

export function getArticleNewSalePriceByPercentage(article, percentage) {
    const perc = percentage.toString().length === 0 ? 0 : parseFloat(percentage)
    const currentPrice = getArticleSalePrice(article)
    return currentPrice + ((currentPrice / 100) * perc)
}

export function getBudgetSubtotal(budget_articles) {
    const totalBudgetArticles = budget_articles.reduce((prev, curr) => prev + (getArticleSalePrice(curr.article) * curr.amount), 0)
    return totalBudgetArticles.toFixed(2)
}

export function getBudgetTotal(budget, subtotal) {
    if (budget.total !== null) return budget.total?.toFixed(2)
    return (subtotal - ((subtotal / 100) * parseFloat(budget.discount))).toFixed(2)
}

export function getDeliveredDeadline(sale) {
    if (!sale.delivered_at) return new Date(Date.now())
    const delivered = new Date(sale.delivered_at)
    delivered.setDate(delivered.getDate() + 20)
    return delivered
}

export function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

export function getCurrentSubtotal(saleArticles, articles) {
    const total = saleArticles.reduce((prev, curr) => {
        const a = articles.find(item => item.id === curr.article_id)
        return prev + (((curr.buy_price ?? a.buy_price) + (((curr.buy_price ?? a.buy_price) / 100) * (curr.earn ?? a.earn))) * (isNaN(parseInt(curr.amount)) ? 0 : parseInt(curr.amount)))
    }, 0)
    return total.toFixed(2)
}

export function getCurrentTotal(saleArticles, articles) {
    const subtotal = getCurrentSubtotal(saleArticles, articles)
    return subtotal
}

export function getDiscountsValues(saleArticles, articles) {
    let supplierIds = []
    let returnValue = []
    saleArticles.forEach(sa => {
        console.log(sa)
        const a = articles.find(item => item.id === (sa.article?.id ?? sa.article_id))
        if (!supplierIds.includes(a.supplier_id)) {
            supplierIds.push(a.supplier_id)
            returnValue.push({
                supplier_name: a.supplier?.name,
                discounts: a?.supplier.discounts.map(d => ({ name: d.name, value: d.value }))
            })
        }
    })
    return returnValue
}

export function getSurchargesValues(saleArticles, articles) {
    let supplierIds = []
    let returnValue = []
    saleArticles.forEach(sa => {
        const a = articles.find(item => item.id === (sa.article?.id ?? sa.article_id))
        if (!supplierIds.includes(a.supplier_id)) {
            supplierIds.push(a.supplier_id)
            returnValue.push({
                supplier_name: a.supplier?.name,
                surcharges: a?.supplier.surcharges.map(d => ({ name: d.name, value: d.value }))
            })
        }
    })
    return returnValue
}