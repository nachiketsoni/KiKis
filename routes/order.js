const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
 
const orderSchema = new mongoose.Schema({
    foodName:String,
    foodPrice:Number,
    foodTime:Number,
    foodRating:Number,
    foodImage:String,
})

module.exports = mongoose.model('Order', orderSchema);