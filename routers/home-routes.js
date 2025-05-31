const express=require('express');
const { getCurrentUser } = require('../controllers/user-controller');
const authMiddleware = require('../middleware/auth-middleware');
const router=express.Router();

router.get('/welcome',authMiddleware,getCurrentUser);

module.exports=router