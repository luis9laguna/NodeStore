//REQUIRED
const { Router } = require('express');

//FUNCTIONS
const { searchAll, SearchOne } = require('../controllers/search');


//CODE
const router = Router();

//SEARCH PRODUCT
router.get('/:term', searchAll);
router.get('/:collection/:term', SearchOne);



module.exports = router;