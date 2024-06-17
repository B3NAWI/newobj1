const mongoose = require("mongoose");

const { Schema } = mongoose;

const LocalizedStringSchema = new Schema({
  ar: { type: String, required: true },
  he: { type: String, required: true }
}, { _id: false });

const CategoryMarketSchema = new Schema({
  name: LocalizedStringSchema,
  file: [String],
});

const CategoryMarket = mongoose.model('CategoryMarket', CategoryMarketSchema);
module.exports = CategoryMarket; 