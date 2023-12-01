const orderModel = require('../Models/Order');
const cartModel = require('../Models/Cart');
const userModel = require('../Models/User.js');
const medModel = require('../Models/Medicine.js');
const Pharmacist = require('../Models/Pharmacist'); 
const sendEmail = require("../Utilities/SendEmail");
const paymentIntentModel=require('../Models/PaymentIntent');
const stripe = require('stripe')(process.env.SECRETKEY);

module.exports.get_orders = async (req,res) => {
    const userId = req.user._id;
    orderModel.find({userId}).sort({date:-1}).then(orders => res.json(orders));
}
module.exports.config=(req,res)=>{
    console.log('here')
    res.send({
      publishableKey: process.env.PUBLISHABLE_KEY,
    });
  }

module.exports.checkoutCredit = async (req,res) => {
    try{
        const userId = req.user._id;
        let cart = await cartModel.findOne({userId});
        let user = await userModel.findOne({_id: userId});
        if(cart){
            const paymentIntent = await stripe.paymentIntents.create({
                amount: cart.bill*100,
                currency: "usd",
                automatic_payment_methods: {
                    enabled: true,
                  },
              });
              const intent=await paymentIntentModel.create({ intentId:paymentIntent.id})

              res.send({
                clientSecret: paymentIntent.client_secret,paymentIntentId:intent._id
              });
        
        }
        else{
            res.status(500).send("You do not have items in cart");
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
module.exports.creditConfirm=async(req,res)=>{
    const userId = req.user._id;
    let cart = await cartModel.findOne({userId});
    let user = await userModel.findOne({_id: userId});
    let address=req.body.address;
    let intentId=req.body.intentId;
    const paymentIntent=await paymentIntentModel.findByIdAndDelete(intentId);
    const pharms=await Pharmacist.find({});
    for (const item of cart.items) {
        const product = await medModel.findOne({ _id: item.productId });
        if (product) {
            // Increase the sales by the quantity in the cart
            product.Sales += item.quantity;
            if(product.Quantity===0){
                for (const pharm of pharms) {
                    const notification = `${product.Name} is out of stock`;
                    pharm.Notifications.push(notification);
                    const emailText = `Dear ${pharm.Name},\nKindly note that the medicine ${product.Name} is out of stock`;
                    await sendEmail(pharm.Email, "Medicine Stock ",emailText );
                    await pharm.save();
                }
            }
            await product.save();
        }
    }
    const order = await orderModel.create({
        userId,
        items: cart.items,
        bill: cart.bill,
        status:'Processing',
        address:address,
        payment_method:'credit',
        paymentIntentId:paymentIntent.intentId,

    });
    const data = await cartModel.findByIdAndDelete({_id:cart.id});
    return res.status(201).send(order);

}
module.exports.checkoutCash = async (req,res) => {
    try{
        const userId = req.user._id;
        let address=req.body.address;
        let cart = await cartModel.findOne({userId});
        let user = await userModel.findOne({_id: userId});
        const pharms=await Pharmacist.find({});
        for (const item of cart.items) {
            const product = await medModel.findOne({ _id: item.productId });
            if (product) {
                // Increase the sales by the quantity in the cart
                product.Sales += item.quantity;
                        if(product.Quantity===0){
                            for (const pharm of pharms) {
                                const notification = `${product.Name} is out of stock`;
                                pharm.Notifications.push(notification);
                                const emailText = `Dear ${pharm.Name},\nKindly note that the medicine ${product.Name} is out of stock`;
                                await sendEmail(pharm.Email, "Medicine Stock ",emailText );
                                await pharm.save();
                            }
                        }
                await product.save();
            }
        }
        if(cart){
           
            
                const order = await orderModel.create({
                    userId,
                    items: cart.items,
                    bill: cart.bill,
                    status:'Processing',
                    address:address,
                    payment_method:'cash',


                });
                const data = await cartModel.findByIdAndDelete({_id:cart.id});
                return res.status(201).send(order);
            
        }
        else{
            res.status(500).send("You do not have items in cart");
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
module.exports.checkoutWallet = async (req,res) => {
    try{
        const userId = req.user._id;
        let cart = await cartModel.findOne({userId});
        let user = await userModel.findOne({_id: userId});
        let address=req.body.address;
        const wallet=user.Wallet;
        if(cart){
            if(wallet<cart.bill){
                console.log('heree');
                res.send("You do not have enough money in wallet");

            }else{
                   user.Wallet-=cart.bill;
                   user.save();
                   const pharms=await Pharmacist.find({});
                   console.log(pharms);
                   for (const item of cart.items) {
                    const product = await medModel.findOne({ _id: item.productId });
                    if (product) {
                        // Increase the sales by the quantity in the cart
                        product.Sales += item.quantity;
                        console.log(product.Quantity);
                        if(product.Quantity===0){
                            console.log('here');
                            for (const pharm of pharms) {
                                console.log('here1');
                                const notification = `${product.Name} is out of stock`;
                                pharm.Notifications.push(notification);
                                const emailText = `Dear ${pharm.Name},\nKindly note that the medicine ${product.Name} is out of stock`;
                                await sendEmail(pharm.Email, "Medicine Stock ",emailText );
                                await pharm.save();
                            }
                        }
                        await product.save();
                    }
                }
                    const order = await orderModel.create({
                        userId,
                        items: cart.items,
                        bill: cart.bill,
                        status:'Processing',
                        address:address,
                        payment_method:'wallet'

                    });
                    const data = await cartModel.findByIdAndDelete({_id:cart.id});
                    return res.status(201).send(order);
                
            }
            
        }
        else{
            res.status(500).send("You do not have items in cart");
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
module.exports.cancelOrder = async (req, res) => {
    try {
        console.log('here');
        const orderId = req.body.orderId; 
        console.log(orderId);
        const userId = req.user._id;
        const order = await orderModel.findById(orderId);

        if (order) {
            switch (order.payment_method) {
                case 'credit':
                    // Handle Stripe payment refund
                    const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
                    await stripe.refunds.create({ payment_intent: paymentIntent.id });
                    break;
    
                case 'wallet':
                    // Refund amount to user's wallet
                    const user = await userModel.findOne({ _id: userId });
                    user.Wallet += order.bill;
                    await user.save();
                    break;
    
                // Add more cases for other payment methods if needed
    
                default:
                    break;
            }
            for (const item of order.items) {
                const product = await medModel.findOne({ _id: item.productId });
                if (product) {
                    product.Sales -= item.quantity;
                    product.Quantity+=item.quantity;
                    await product.save();
                }
            }
    
            order.status = 'Cancelled';
            await order.save();

            res.status(200).send("Order cancelled successfully");
        } else {
            res.status(404).send("Order not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}