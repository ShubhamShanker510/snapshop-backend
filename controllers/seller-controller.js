const userId=req.userInfo.userId;
const user=await User.findOne({_id: userId});

if(!user){
    return res.status(400).json({
        success: false,
        message: "No user found"
    })
}

const {id, title, price, description, rate, quantity, category}=req.body;

const image = req.body.image || (req.file ? req.file.path : null); 

if(!id || !image){
    return res.status(400).json({
        success: false,
        message:"Item details are required"
    })
}

//upload to cloudinary and generating link
const cloudinaryUrl=await uploadtocloundinary(req.file.path)
if(!cloudinaryUrl){
    return res.status(400).json({
        success: false,
        message:"file uploading to cloudinary failed"
    })
}

const products={
    id,
    image: cloudinaryUrl,
    title,
    price,
    description,
    rate,
    quantity,
    category

}

// check if cart is already present of the current user
const userCart = await Cart.findOne({ userId });
console.log("user productscart=>",userCart)

if(!userCart){
    await Cart.create({
        userId,
        cartProducts: [products]
    })
}
else{
    id
    //if existing product is already present
    const exisitingProduct=userCart.cartProducts.find(item=> item.id===id);
    console.log("exisitng product=>",userCart.cartProducts)

    if(!exisitingProduct){
        userCart.cartProducts.push(products);
        await userCart.save();
    }
    else{
        exisitingProduct.quantity+=quantity
        await userCart.save();
    }
}

return res.status(200).json({
    success: true,
    message: "Cart updated successfully",
})
