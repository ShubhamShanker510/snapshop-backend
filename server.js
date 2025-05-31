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

const allowedOrigins = [
    'http://localhost:5173',
    'https://snapshopecommerce.netlify.app'
  ];
  
  app.use(cors({
    origin: function(origin, callback) {
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
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