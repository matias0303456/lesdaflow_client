export function getStock(article) {
    if (!article) return
    return article.incomes?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0) - article.outcomes?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0) + article.client_returns?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0) - article.supplier_returns?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0)
}