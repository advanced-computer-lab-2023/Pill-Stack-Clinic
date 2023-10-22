const express = require('express');
let router = express.Router();
const stripe=require("stripe")("sk_test_51O3yL5I39njhw9EQpOEnRxLEGkrBIBGXjBPkTGd6iZV3HRJYNGvgwYNh0INZSN5S6UDfVql2BW4Fc7C9rQS5gL7d00S90okrhW");
const{v4:uuidv4}=require('uuid');
router.post("/pay",(req,res,next)=>{
    const{token,amount}=req.body;
    const idempotencyKey=uuidv4();
    return stripe.customers.create({
        email:token.email,
        source:token
    }).then(customer=>{
        stripe.charges.create({
        amount:amount*100,
        currency:'egp',
        customer:customer.id,
        receipt_email:token.email
    },{idempotencyKey})
    }).then(result =>{
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err);
    });
});