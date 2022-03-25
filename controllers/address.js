//REQUIRED
const Address = require('../models/address');
const User = require('../models/user')
const jwt = require('jsonwebtoken');

//CODE

//GET
const getAddressesByUser = async (req, res) => {

    try {
        //GET DATA FROM THE DB
        const userId = req.id;
        const addresses = await Address.find({ 'user': userId }).populate('user', 'address');

        res.json({
            ok: true,
            addresses
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//GET BY ID
const getAddressByID = async (req, res) => {

    try {
        //GET DATA FROM THE DB
        const addressId = req.params.id;
        const address = await Address.findById(addressId)

        res.json({
            ok: true,
            address: address.address
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Unexpected Error"
        });
    }
}

//CREATE
const createAddress = async (req, res) => {

    try {
        //INFO NEEDED
        const token = req.header('Authorization');
        let addresses = new Array
        let userId
        if (!token || token !== "null") {
            const infoToken = jwt.verify(token, process.env.JWT_SECRET);
            userId = infoToken.id
            addresses = await Address.find({ 'user': userId })
        }

        //MAX 3 ADDRESES
        if (addresses.length >= 3) {
            return res.status(404).json({
                ok: false,
                message: "You can't create more than 3 addresses per user"
            });
        }

        //CREATE ADDRESS
        let address
        address = new Address(req.body);

        //IF USER
        if (userId) {
            address.user = userId || null

            //UPDATING DEFAULT USER ADDRESS
            await User.findByIdAndUpdate(userId, { address: address.id })
        }

        //SAVE ADDRESS
        await address.save();

        res.json({
            ok: true,
            address
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });

    }
}


//UPDATE    
const updateAddress = async (req, res) => {

    try {
        //GET DATA FROM THE DB
        const id = req.params.id;
        const addressDB = await Address.findById(id);

        //VERIFY ADDRESS
        if (!addressDB) {
            return res.status(404).json({
                ok: false,
                message: "Address not found"
            });
        }

        //UPDATE ADDRESS
        const { user, ...field } = req.body;
        const addressUpdate = await Address.findByIdAndUpdate(id, field, { new: true });

        //UPDATING DEFAULT USER ADDRESS
        await User.findByIdAndUpdate(req.id, { address: id })

        res.json({
            ok: true,
            address: addressUpdate
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}

//MAKE ADDRESS DEFAULT    
const makeAddressDefault = async (req, res) => {

    try {
        //GET DATA FROM THE DB
        const id = req.params.id;
        const addressDB = await Address.findById(id);

        //VERIFY ADDRESS JUST IN CASE
        if (!addressDB) {
            return res.status(404).json({
                ok: false,
                message: "Address not found"
            });
        }

        //UPDATING DEFAULT USER ADDRESS
        await User.findByIdAndUpdate(req.id, { address: id })

        res.json({
            ok: true,
            message: 'Default Address Updated'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}


//DELETE
const deleteAddress = async (req, res) => {

    try {
        //GET DATA FROM THE REQ
        const id = req.params.id;
        const userId = req.id;

        //GET DATA FROM THE DB
        const addressDB = await Address.findById(id);

        //VERIFY ADDRESS
        if (!addressDB) {
            return res.status(404).json({
                ok: false,
                message: "Address not found"
            });
        }

        //GET USER
        const user = await User.findById(userId)

        //REMOVING ADDRESS FROM DB
        await Address.findByIdAndRemove(id);

        //DELETING ADDRESS FROM USER
        if (user.address == id) {
            user.address = null;
            user.save()
        }

        res.json({
            ok: true,
            message: "Address deleted",
            user
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error Unexpected, check logs"
        });
    }
}



module.exports = {
    getAddressesByUser,
    getAddressByID,
    createAddress,
    updateAddress,
    makeAddressDefault,
    deleteAddress
}