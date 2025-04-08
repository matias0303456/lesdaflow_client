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

export function saleIsPrepared(sale) {
    return sale.sale_articles.every(sa => sa.is_prepared)
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

export function getAvailableDiscounts(formData, saleArticles, articles, discounts) {
    if (saleArticles.length === 0) return []
    const date = new Date(formData.date)
    const type = formData.type
    return discounts.filter(discount => {
        const { from, to, discount_by_articles, discount_by_suppliers, sale_type } = discount
        const discountArticles = discount_by_articles.map(dbp => dbp.article_id)
        const discountSuppliers = discount_by_suppliers.map(dbs => dbs.supplier_id)
        if (
            ((!from && !to) || (from && to && new Date(from) < date && new Date(to) > date)) &&
            (!sale_type || sale_type === type) &&
            ((discountSuppliers.length === 0 && discountArticles.length === 0) || saleArticles.some(sa => {
                const article = sa.article ?? articles.find(p => p.id === sa.article_id)
                return discountSuppliers.includes(article.supplier_id) || discountArticles.includes(article.id)
            }))
        ) return discount
    })
}

export function getCurrentSubtotal(saleArticles, articles) {
    const total = saleArticles.reduce((prev, curr) => {
        const p = articles.find(item => item.id === curr.article_id)
        return prev + (((curr.buy_price ?? p.buy_price) + (((curr.buy_price ?? p.buy_price) / 100) * (curr.earn ?? p.earn))) * (isNaN(parseInt(curr.amount)) ? 0 : parseInt(curr.amount)))
    }, 0)
    return total.toFixed(2)
}

export function getCurrentTotal(discount, saleArticles, articles) {
    const { discount_by_suppliers, discount_by_articles, value } = discount
    const subtotal = getCurrentSubtotal(saleArticles, articles)
    if (discount_by_suppliers?.length === 0 && discount_by_articles?.length === 0) {
        return (subtotal - ((subtotal / 100) * value)).toFixed(2)
    }
    const discountArticles = discount_by_articles?.map(dbp => dbp.article_id)
    const discountSuppliers = discount_by_suppliers?.map(dbs => dbs.supplier_id)
    const returnValue = saleArticles.reduce((total, sa) => {
        const article = sa.article ?? articles.find(p => p.id === sa.article_id)
        const salePrice = getArticleSalePrice(article)
        if (discountSuppliers?.includes(article.supplier_id) || discountArticles?.includes(article.id)) {
            const salePriceWithDiscount = salePrice - ((salePrice / 100) * value)
            return total + salePriceWithDiscount
        }
        return parseFloat(total + subtotal)
    }, 0)
    return returnValue.toFixed(2)
}