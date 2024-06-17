const express = require('express')
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const router = express.Router()

router.post("/payments" , async(req,res)=>{
    const {amount} = req.body

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency:"usd"
        })
        res.status(200).send(paymentIntent.client_secret)
        
    } catch (error) {
        res.status(500).json({message:error.message}) 
    }
})

module.exports = router
