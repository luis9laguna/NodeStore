function sellInformation(data) {

    //TOTAL OF COMPLETED ORDERS
    const totalCompleted = data.length;

    //TOTAL OF SOLD AND COST
    let totalSold = []
    let totalCost = []

    data.map(array => {
        totalSold.push(array.total)
        totalCost.push(array.totalCost)
    });

    totalSold = totalSold.reduce((a, b) => a + b, 0);
    totalCost = totalCost.reduce((a, b) => a + b, 0);

    //TOTAL REVENUE
    const totalRevenue = totalSold - totalCost

    return {
        totalCompleted,
        totalSold,
        totalCost,
        totalRevenue
    }


}

module.exports = {
    sellInformation
}