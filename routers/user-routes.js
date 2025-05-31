const express=require('express');
const { registerUser, loginUser, updateUserPassword, getCurrentUser, logoutUser } = require('../controllers/user-controller');
const authMiddleware = require('../middleware/auth-middleware');
const router=express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser)
router.get('/get',authMiddleware,getCurrentUser)
router.delete('/delete', authMiddleware, logoutUser)
router.patch('/update-password',authMiddleware,updateUserPassword)

module.exports=router;
