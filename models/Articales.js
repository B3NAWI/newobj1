// const mongoose = require("mongoose");

// const { Schema } = mongoose;

// const ArticalesSchema = new Schema({
//   category:String,
//   name: String,
//   title: String,
//   information: String,
//   price: Number,
//   number: Number,
//   file: [String],
// }
// );

// const Articales = mongoose.model('Articales', ArticalesSchema);
// module.exports = Articales; 


const mongoose = require("mongoose");

const { Schema } = mongoose;

const LocalizedStringSchema = new Schema({
  ar: { type: String, required: true },
  he: { type: String, required: true }
}, { _id: false });

const ArticalesSchema = new Schema({
  category: LocalizedStringSchema,
  name: LocalizedStringSchema,
  title: LocalizedStringSchema,
  information: LocalizedStringSchema,
  price: Number,
  number: Number,
  file: [String]
});

const Articales = mongoose.model('Articales', ArticalesSchema);
module.exports = Articales;
