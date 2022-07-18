const mongoose = require('mongoose');
 
const orderSchema = new mongoose.Schema({
    foodName:String,
    foodPrice:Number,
    foodTime:Number,
    foodRating:Number,
    foodImage:String,
    foodOwner:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    foodQuantity:{
        type:Number,
        default:1
    }
})

module.exports = mongoose.model('Order', orderSchema);