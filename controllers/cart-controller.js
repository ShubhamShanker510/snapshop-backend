const Cart = require("../models/cart-model");
// const uploadtocloundinary = require("../utils/cloudinary");
const User = require("../models/user-model");

const addToCart = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found",
      });
    }

    const { id, image, title, price, description, rate, quantity, category } = req.body;

    if (!id || !price || isNaN(price) || isNaN(quantity)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data. Price and Quantity should be valid numbers.",
      });
    }

    const products = {
      id:id,
      image,
      title,
      price: parseFloat(price), // Ensure price is a number
      description,
      rate,
      quantity,
      category,
      totalPrice: parseFloat(price) * quantity, // Ensure totalPrice is calculated correctly
    };

    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      await Cart.create({
        userId,
        cartProducts: [products],
      });
    } else {
      const existingProduct = userCart.cartProducts.find(
        (item) => item.id === id
      );

      if (!existingProduct) {
        userCart.cartProducts.push(products);
        await userCart.save();
      } else {
        existingProduct.quantity += quantity;
        existingProduct.totalPrice = existingProduct.price * existingProduct.quantity;
        await userCart.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.log("Failed to add item to cart=>", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


const updateCartQuantity=async(req,res)=>{
  try {
    const userId=req.userInfo.userId;
    const userCart=await Cart.findOne({userId})
    console.log("update cart quantity=>",userCart)

    if(!userCart){
      return res.status(400).json({
        success: false,
        message: "No user cart found"
      })
    }

    
    const id=req.params.id || req.body.id;

    if(!id){
      return res.status(400).json({
        success: false,
        message: "No product id found"
      })
    }

    const {quantity}=req.body;

    const existingProduct=await userCart.cartProducts.find((item)=> item.id===id);

    if(!existingProduct){
      return res.status(400).json({
        sucess: false,
        message: "Product not found"
      })
    }


    existingProduct.quantity=quantity;
    existingProduct.totalPrice=existingProduct.price*existingProduct.quantity;
    await userCart.save();

    return res.status(200).json({
       success: true,
       message: "Quantity updated sucessfully",
       data: existingProduct
    })

    
  } catch (error) {
    console.log("Update cart Quantity error=>",error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    })
  }
};

const deleteCartProduct = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    let userCart=await Cart.findOne({userId})

    if (!userCart) {
      return res.status(400).json({
        success: false,
        message: "User ID not found",
      });
    }

    const productId = req.params.id || req.body.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "No product ID found",
      });
    }

    
    const existingProduct=await userCart.cartProducts.find((item)=> item.id===productId);


    if(!existingProduct){
      return res.status(400).json({
        success: false,
        message: "No product found"
      })
    }
    

    await Cart.updateOne(
      { userId },
      { $pull: { cartProducts: { id: productId } } }
    );

    userCart=await Cart.findOne({userId});
    const removeUserfromCartDatabase=userCart.cartProducts.length;

    if(removeUserfromCartDatabase===0){
      await Cart.findOneAndDelete({ userId });
    }
    

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.log("Deleting cart product error =>", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getallProducts=async(req,res)=>{
  try {
    const userId=req.userInfo.userId;
    const userCart=await Cart.findOne({userId});

    if(!userCart){
      return res.status(400).json({
        succes: false,
        message: "No user found"
      })
    }

    return res.status(200).json({
      succes: true,
      message: "All products found successfully",
      cart: userCart.cartProducts
    })
    
  } catch (error) {
    console.log("Getting all products failed=>", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    })
  }
}

const getProductByproductId=async(req,res)=>{
  try {
    const userId=req.userInfo.userId;
    const userCart=await Cart.findOne({userId});

    if(!userCart){
      return res.status(400).json({
        sucess: false,
        message: "No user found"
      })
    }

    const productId=req.params.id || req.body.id;

    if(!productId){
      return res.status(400).json({
        success: false,
        message: "No product id found"
      })
    }

    const exisitngProduct=userCart.cartProducts.find((item)=>item.id===productId);

    if(!exisitngProduct){
      return res.status(400).json({
        success: false,
        message: "Product not found"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Product found successfully",
      product: exisitngProduct
    })

    
  } catch (error) {
    console.log("Product by ID=> failed",error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    })
  }
}



module.exports = { addToCart, updateCartQuantity, deleteCartProduct, getallProducts, getProductByproductId};
