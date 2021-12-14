//REQUIRED
const Address = require('../models/address'); 

//CODE

//GET
const getAddressesByUser = async(req, res) =>{

    try{

        const id = req.params.id;
        const addresses = await Address.find({"user": id});
    
        res.json({
            ok: true,
            addresses
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
const createAddress = async(req, res) => {

    try{
        
        //CREATE ADDRESS
        const address = new Address(req.body);


        //SAVE ADDRESS
        await address.save();
        
        res.json({
            ok: true,
            address
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
const updateAddress = async (req, res) =>{

    try{
        
        const id = req.params.id;
        const addressDB = await Address.findById(id);

        //VERIFY ADDRESS
        if(!addressDB){
            return res.status(404).json({
                ok: false,
                message: "Address not found"
            });
        }

        //UPDATE ADDRESS
        const { __v, user, ...field } = req.body;
        const addressUpdate = await Address.findByIdAndUpdate(id, field, { new: true });
        
        res.json({
            ok:true,
            address: addressUpdate
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
const deleteAddress = async (req, res) => {

    try{
        
        const id = req.params.id;
        const addressDB = await Address.findById(id);

        //VERIFY ADDRESS
        if(!addressDB){
            return res.status(404).json({
                ok: false,
                message: "Address not found"
            });
        }

        await Address.findByIdAndRemove( id, addressDB );
        
        res.json({
            ok:true,
            message: "Address deleted"
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
    getAddressesByUser,
    createAddress,
    updateAddress,
    deleteAddress
}