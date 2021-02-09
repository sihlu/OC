const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/:id/like', sauceCtrl.likeSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/',  sauceCtrl.getSauces);
router.get('/:id',  sauceCtrl.getSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id',  sauceCtrl.deleteSauce);


module.exports = router;
