//REQUIRED
const { Router } = require('express');
const { check } = require('express-validator');

//FUNCTIONS
const { searchAll, SearchOne } = require('../controllers/search');
const { checkParams } = require('../middlewares/check-params');



//CODE
const router = Router();

//SEARCH PRODUCT
router.get('/:term',
[
    check('term', 'Term is required').not().isEmpty().trim().escape(),
    checkParams
],
 searchAll);
router.get('/:collection/:term',
[
    check('collection', 'Collection is required').not().isEmpty().trim().escape(),
    check('term', 'Term is required').not().isEmpty().trim().escape(),
    checkParams
],
 SearchOne);



module.exports = router;