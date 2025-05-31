const mongoose=require('mongoose')

const cartSchema=mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    cartProducts:[
        {
            id: {
                type: String,
                required:true
            },
            image:{
                type: String,
                required: true
            },
            title:{
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            description:{
                type: String,
                required: true
            },
            rate:{
                type: String,
                required: true
            },
            quantity:{
                type: Number,
                required: true
            },
            category:{
                type:String,
                enum:["men's clothing","jewelery","electronics","women's clothing"],
                required: true
            },
            totalPrice:{
                type: Number,
            }

        }
    ]

},{timestamps: true})

module.exports=mongoose.model("Cart",cartSchema);