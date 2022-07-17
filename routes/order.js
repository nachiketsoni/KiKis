const mongoose = require('mongoose');
 
const orderSchema = new mongoose.Schema({
    foodName:String,
    foodPrice:Number,
    foodTime:Number,
    foodRating:Number,
    foodImage:String,
    user:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('Order', orderSchema);