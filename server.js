require('dotenv').config()
const express=require('express');
const connectDb = require('./database/db');
const cors=require('cors')
const cookieParser=require('cookie-parser')
const app=express();
const userRoute=require('./routers/user-routes')
const homeRoute=require('./routers/home-routes')
const cartRoute=require('./routers/cart-routes')
const port=process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(cors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],  // Allow PATCH
    credentials: true,  // Make sure cookies are sent
    origin: "http://localhost:5173"  // Specify the front-end origin
}));


app.use('/api/user',userRoute)
app.use('/api/home',homeRoute)
app.use('/api/cart',cartRoute)


connectDb()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
    })
})
.catch((error)=>{
    console.log("Connection Failed=>", error);
})