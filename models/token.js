const mongoose = require("mongoose");

const { Schema } = mongoose;


const tokenSchema = new Schema({
    token:String,
    retoken:String,
})
 

const Tokens = mongoose.model('Tokens', tokenSchema);
module.exports = Tokens; 