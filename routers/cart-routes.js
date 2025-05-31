const express=require('express')
const router=express.Router()
const authMiddleware=require('../middleware/auth-middleware')
const { addToCart, updateCartQuantity, deleteCartProduct, getallProducts, getProductByproductId } = require('../controllers/cart-controller')
const upload=require('../middleware/multer-middleware')

router.get('/products', authMiddleware,getallProducts);
router.get('/product/:id', authMiddleware, getProductByproductId);
router.post('/add-to-cart', authMiddleware, addToCart);
router.post('/:id',authMiddleware, updateCartQuantity);
router.delete('/:id', authMiddleware, deleteCartProduct);


module.exports=router