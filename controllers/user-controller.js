const User=require('../models/user-model')
const bcryptjs=require('bcryptjs')
const jwt =require('jsonwebtoken');


const registerUser=async(req,res)=>{
    try {
        const {name,email,phone, password}=req.body;

        if(!name || !email || !phone || !password){
            return res.status(400).json({
                sucess: false,
                message:"All fields are mandatory"
            })
        }

        //hash password
        const salt= await bcryptjs.genSalt(10);
        const hashedPassword= await bcryptjs.hash(password,salt)

        if(!hashedPassword){
            return res.status(500).json({
                sucess: false,
                message: "Error while hashing password"
            })
        }

        // create new user
        const newUser=await User.create({
            name,
            email,
            phone,
            password: hashedPassword
        })

        if(!newUser){
            return res.status(400).json({
                sucess: false,
                message: "Error in registering new user"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "User registered successfully"
        })
        
    } catch (error) {
        console.log("Error in register User=>", error);
        return res.status(500).json({
            sucess: false,
            message: "Something went wrong"
        })
    }
}

const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({
                sucess: false,
                message: "All fields are mandatory"
            })
        }

        // find user
        const getUser=await User.findOne({email});

        if(!getUser){
            return res.status(400).json({
                sucess: false,
                message: "No user found"
            })
        }

        // verify password
        const isValidPassword=await bcryptjs.compare(password,getUser.password);

        if(!isValidPassword){
            return res.status(400).json({
                sucess: false,
                message:"Invalid credentials"
            })
        }

        //generate access token
        const accessToken=jwt.sign({
            userId:getUser._id,
            name: getUser.name,
            email: getUser.email,
            phone: getUser.phone,

        },process.env.JWT_SECRET_KEY,{
            expiresIn:"50m"
        })

        if(!accessToken){
            return res.status(400).json({
                sucess: false,
                message: "Error while generating token"
            })
        }

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 60 * 1000, 
          });
          

        return res.status(200).json({
            sucess: true,
            message: "User login successfully",
            accessToken: accessToken
        })


        
    } catch (error) {
        console.log("Error in login user", error)
        return res.status(500).json({
            sucess: false,
            message: "Something went wrong"
        })
    }
}

const getCurrentUser=async(req,res)=>{
    const {name, email,phone}=req.userInfo;
    try {

        const userData={
            name,
            email,
            phone
        }
        
        return res.status(200).json({
            success: true,
            message: "User data recieved sucessfully",
            data: userData
        })
        
    } catch (error) {
        console.log("Error in getting currentUser",error);
        return res.status(500).json({
            sucess: false,
            message: "Something went wrong"
        })
    }
}

const updateUserPassword = async (req, res) => {
    try {
      const userData = req.userInfo.userId;
      const currentUser = await User.findOne({ _id: userData });

  
      if (!currentUser) {
        return res.status(400).json({
          success: false,
          message: "No user found"
        });
      }
  
      const { oldPassword, newPassword } = req.body;
  
    
      const isValidPassword = await bcryptjs.compare(oldPassword, currentUser.password);
      console.log("isValidPassword", isValidPassword);
  
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: "Invalid old password"
        });
      }

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(newPassword, salt);
  
      if (!hashedPassword) {
        return res.status(400).json({
          success: false,
          message: "Unable to hash password"
        });
      }
  

      currentUser.password = hashedPassword;
      await currentUser.save();
  
      return res.status(200).json({
        success: true,
        message: "Password updated successfully"
      });
    } catch (error) {
      console.log("Update password error=>", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong"
      });
    }
  };


const logoutUser = async (req, res) => {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.log("Error in deleting cookie =>", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


  
module.exports={registerUser, loginUser, getCurrentUser, updateUserPassword, logoutUser}