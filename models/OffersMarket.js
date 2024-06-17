const mongoose = require("mongoose");

const { Schema } = mongoose;

const OffersMarketSchema = new Schema({
  file: [String],
});

const OffersMarket = mongoose.model('OffersMarket', OffersMarketSchema);
module.exports = OffersMarket; 