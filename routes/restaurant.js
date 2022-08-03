const mongoose = require("mongoose");

const restrauntSchema = mongoose.Schema({
          storeName:String,
          storeAddress:String,
          restaurantOwner:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
          }
});
module.exports = mongoose.model('restaurant', restrauntSchema);
