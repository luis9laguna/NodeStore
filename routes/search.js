//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { searchProducts } = require('../controllers/search');
const { checkParams } = require('../middlewares/check-params');

//CODE
const router = Router();

//SEARCH
router.get('/:term',
    [
        check('term', 'Term is required').not().isEmpty().trim().escape(),
        checkParams
    ],
    searchProducts);



module.exports = router;