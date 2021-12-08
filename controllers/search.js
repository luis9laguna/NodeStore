//REQUIRED
const Product = require ('../models/product');
const Category = require('../models/category');

//CODE


const searchAll = async (req, res) => {

    try {

        const term = req.params.term;
        const regex = new RegExp(term , 'i')

        const [ products, categories ] = await Promise.all([

            Product.find({name: regex}),
            Category.find({name: regex})
        ]);
        
        res.json({
            ok: true,
            products,
            categories
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }    


}


//SEARCH ONE
const SearchOne = async (req, res) => {

    try{

        const collection = req.params.collection;
        const term = req.params.term;
        const regex = new RegExp(term , 'i')
        let data = [];

        switch (collection){
            case 'product':
                data = await Product.find({name: regex});     
            break;

            case 'category':
                data = await Category.find({name: regex});
            break;

            default:
                 res.status(400).json({
                    ok: false,
                    message: "The params has to be 'product' or 'category'"
                });  
        }

        res.json({
            ok: true,
            results: data
        });
        
    } catch(err){
        console.log(err);
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

module.exports = {
    searchAll,
    SearchOne
}