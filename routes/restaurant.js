const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema({
          storeName:String,
          storeAddress:String,
          since:String,
          restaurantOwner:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
          }
          
          
});
module.exports = mongoose.model('restaurant', restaurantSchema);
