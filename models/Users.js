const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new Schema({
  user: {
    type: String,
  },
  email: {
    type: String,
  },
  verifyEmail:{
    type:String,
    enum:[true , false],
    default:false
  },
  phone: String,
  password: {
    type: String,
  },
  passwordChangedat: {
    type: Date,
  },
  select: {
    type: String,
  },
  date: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  active: {
    type: String,
    enum: [true, false],
    default: true
  },
  address: {
    type: [{
      city: { type: String, required: false },
      district: { type: String, required: false },
      street: { type: String, required: false },
      architectureName: { type: String, required: false },
      apartmentNumber: { type: String, required: false },
      floorNumber: { type: String, required: false },
      additionalDetails: { type: String, required: false },
    }],
    default: []
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetTokenExpires: {
    type: Date,
  },
  verifyEmailToken: {
    type: String,
  },
  verifyEmailTokenExpires: {
    type: Date,
  },
},
);
UserSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex') 
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; 
  return resetToken;
}
UserSchema.methods.createverifyEmailToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex') 
  this.verifyEmailToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.verifyEmailTokenExpires = Date.now() + 10 * 60 * 1000; 
  return resetToken;
}
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


const Users = mongoose.model('Users', UserSchema);
module.exports = Users; 