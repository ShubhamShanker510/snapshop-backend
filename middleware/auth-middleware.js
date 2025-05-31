const jwt=require('jsonwebtoken')

const authMiddleware=async(req,res,next)=>{
    try {
        const header=req.headers['authorization'] || req.cookies.accessToken;;

        const token=header && header.startsWith("Bearer ")? header.split(" ")[1]: header;

        if(!token){
            return res.status(400).json({
                sucess: false,
                message: "no token found"
            })
        }

        const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(!decodeToken){
            return res.status(400).json({
                success: false,
                message: "Unable to decode token"
            })
        }

        req.userInfo=decodeToken;
        console.log(req.userInfo)

        next();
        
    } catch (error) {
        console.log("auth middleware error=>",error);
        return res.status(500).json({
            sucess: false,
            message: "Something went wrong"
        })
    }
}

module.exports=authMiddleware