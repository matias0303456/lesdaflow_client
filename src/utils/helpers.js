export function getStock(product) {
    if (!product) return
    return product.incomes?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0) - product.sales?.reduce((prev, curr) => {
        return prev + curr.amount
    }, 0)
}