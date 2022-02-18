function sortProducts(sort) {

    let newSort = null

    //SORTING SORT
    if (sort === 'name') newSort = { name: 'asc' }
    else if (sort === 'popularity') newSort = { likes: 'desc' }
    else if (sort === 'newest') newSort = { created: 'asc' }
    else if (sort === 'priceAsc') newSort = { price: 'asc' }
    else if (sort === 'priceDesc') newSort = { price: 'desc' }
    else sort = { name: 'asc' }

    return {
        newSort
    }


}

module.exports = {
    sortProducts
}