//REQUIRED
const Cart = require('../models/cart'); 

//CODE

//GET
const getCart = async(req, res) =>{

    try{

        const uid = req.params.id;
        const cart = await Cart.find({"user": uid});
    
        res.json({
            ok: true,
            cart
        });

    }catch(err){

        console.log(err);
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//CREATE
const createCart = async(req, res) => {

    try{
        
        //CREATE ADDRESS
        const cart = new Cart(req.body);

        //SAVE ADDRESS
        await cart.save();
        
        res.json({
            ok: true,
            cart
        });
        
    } catch(err){

        console.log(err);
        res.status(500).json({
            ok:false,
            message: "Error Unexpected, check logs"
        });

    }
}


//UPDATE    
const updateCart = async (req, res) =>{

    try{
        
        const uid = req.params.id;
        const cartDB = await Cart.findOne({"user":uid});

        //VERIFY CART
        if(!cartDB){
            return res.status(404).json({
                ok: false,
                message: "Cart not found"
            });
        }

        //UPDATE CART
        const { __v, user, ...field } = req.body;
        const cartUpdate = await Cart.findOneAndUpdate({"user":uid}, field, { new: true });
        
        res.json({
            ok:true,
            cart: cartUpdate
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok:false,
            message: "Error Unexpected, check logs"
        });
    }
}


//DELETE
const deleteCart = async (req, res) => {

    try{
        
        const uid = req.params.id;
        const cartDB = await Cart.findOneAndRemove({"user":uid})
        //VERIFY ADDRESS
        if(!cartDB){
            return res.status(404).json({
                ok: false,
                message: "Cart not found"
            });
        }

        await Cart.findByIdAndRemove( uid, cartDB );
        
        res.json({
            ok:true,
            message: "Cart deleted"
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok:false,
            message: "Error Unexpected, check logs"
        });
    }
}



module.exports = {
    getCart,
    createCart,
    updateCart,
    deleteCart
}