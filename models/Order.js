// const mongoose = require("mongoose");

// const { Schema } = mongoose;

// const OrderSchema = new Schema({
//     cart: [{
//         category: String,
//         name: String,
//         title: String,
//         information: String,
//         price: Number,
//         number: Number,
//         file: [String],
//         quantity: Number,
//     }],
//     receiptAddress: {
//         type: {
//             city: { type: String, required: false },
//             district: { type: String, required: false },
//             street: { type: String, required: false },
//             architectureName: { type: String, required: false },
//             apartmentNumber: { type: String, required: false },
//             floorNumber: { type: String, required: false },
//             additionalDetails: { type: String, required: false },
//         },
//         default: []
//     },
//     receipt: {
//         type: String,
//     },
//     payment: {
//         type: String,
//     },
//     quantity: {
//         type: String,
//     },
//     totalPrice: {
//         type: Number,
//     },
//     UserDetails: {
//         id: { type: String },
//         name: { type: String },
//         phone: { type: String },
//     },
//     status: {
//         type: String,
//         enum: ["new", "watched", "in preparation", "in the way", "received"],
//         default: "new",
//     },
//     DateOrder: {
//         type: String,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now()
//     }
// });

// const Order = mongoose.model('Order', OrderSchema);
// module.exports = Order; 



const mongoose = require("mongoose");

const { Schema } = mongoose;

const LocalizedStringSchema = new Schema({
  ar: { type: String, required: true },
  he: { type: String, required: true }
}, { _id: false });

const OrderSchema = new Schema({
  cart: [{
    category: LocalizedStringSchema,
    name: LocalizedStringSchema,
    title: LocalizedStringSchema,
    information: LocalizedStringSchema,
    price: Number,
    number: Number,
    file: [String],
    quantity: Number,
  }],
  receiptAddress: {
    type: {
      city: String,
      district: String,
      street: String,
      architectureName: String,
      apartmentNumber: String,
      floorNumber: String,
      additionalDetails: String,
    },
    default: {}
  },
  receipt: LocalizedStringSchema,
  payment: LocalizedStringSchema,
  quantity: String,
  totalPrice: Number,
  UserDetails: {
    id: { type: String },
    name: [String],
    phone: { type: String },
  },
  status: {
    type: {
      ar: {
        type: String,
        enum: ["جديد", "مشاهد", "قيد التحضير", "في الطريق", "مستلم"],
        default: "جديد",
      },
      he: {
        type: String,
        enum: ["חָדָשׁ", "צפה", "בהכנה", "בדרך", "קיבלו"],
        default: "חָדָשׁ",
      }
    },
    default: { he: "חָדָשׁ", ar: "جديد" }
  },
  DateOrder: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
