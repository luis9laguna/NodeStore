//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { getUser, createUser, updateUser, deleteUser } = require('../controllers/user');

//CODE
const router = Router();

//GET
router.get('/', getUser);

//POST
router.post('/',
    createUser);

//PUT
router.put('/:id',
    updateUser);

//DELETE
router.delete('/:id',  deleteUser);



module.exports = router;