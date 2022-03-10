function sortProducts(sort) {

    let newSort = null

    //SORTING SORT
    if (sort === 'name') newSort = { name: 'asc' }
    else if (sort === 'popularity') newSort = { likes: 'desc' }
    else if (sort === 'newest') newSort = { createdAt: 'desc' }
    else if (sort === 'priceAsc') newSort = { price: 'asc' }
    else if (sort === 'priceDesc') newSort = { price: 'desc' }
    else newSort = { name: 'asc' }

    return newSort

}

module.exports = {
    sortProducts
}