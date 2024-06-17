const mongoose = require("mongoose");

const { Schema } = mongoose;

const SupportSchema = new Schema({

  select: String,
  massege: String,
  
});

const Support = mongoose.model('Support', SupportSchema);
module.exports = Support; 