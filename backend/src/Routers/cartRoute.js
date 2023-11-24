const { Router } = require('express');
const cartController = require('../Routes/cartController');
const {  userVerification } = require('../Middleware/AuthMiddleware')

const router = Router();

router.get('/',userVerification,cartController.get_cart_items);
router.post('/',userVerification,cartController.add_cart_item);
router.post('/update',userVerification,cartController.update_cart_item);

router.delete('/:itemId',userVerification,cartController.delete_item);

module.exports = router;